import { DatabaseTableQueryService } from "@/app/services/query/debug/db/tables";
import {
  SearchHeaderColumnModel,
  SearchTableDetailsModel,
  TableDetailsModel,
} from "@/types/debug";
import { ServiceContext } from "@/types/shared/service-context";
import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/utils/errors";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "@/container/types";

@injectable()
export class PrismaDatabaseTableQueryService
  implements DatabaseTableQueryService
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async getAllTables(context: ServiceContext): Promise<TableDetailsModel[]> {
    const query = `
    WITH table_columns AS (
      SELECT
        n.nspname AS schema_name,
        cl.relname AS table_name,
        a.attname AS column_name,
        a.attnum AS column_order,
        pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
        NOT a.attnotnull AS is_nullable,
        pg_catalog.pg_get_expr(ad.adbin, ad.adrelid) AS default_value,
        EXISTS (
          SELECT 1
          FROM pg_catalog.pg_constraint con
          WHERE con.conrelid = cl.oid AND con.contype = 'p' AND con.conkey::smallint[] @> ARRAY[a.attnum]
        ) AS is_primary,
        EXISTS (
          SELECT 1
          FROM pg_catalog.pg_index ind
          WHERE ind.indrelid = cl.oid AND ind.indisunique AND ind.indkey::smallint[] @> ARRAY[a.attnum]
        ) AS is_unique,
        COALESCE(
          (SELECT string_agg(enumlabel, ',') FROM pg_enum WHERE enumtypid = a.atttypid),
          ''
        ) AS enum_labels,
        COALESCE(
          (SELECT fk_cl.relname 
          FROM pg_catalog.pg_constraint con
          JOIN pg_catalog.pg_class fk_cl ON con.confrelid = fk_cl.oid
          WHERE con.conrelid = cl.oid AND con.contype = 'f' AND con.conkey::smallint[] @> ARRAY[a.attnum]),
          ''
        ) AS foreign_table
      FROM
        pg_catalog.pg_attribute a
        JOIN pg_catalog.pg_class cl ON a.attrelid = cl.oid
        JOIN pg_catalog.pg_namespace n ON cl.relnamespace = n.oid
        LEFT JOIN pg_catalog.pg_attrdef ad ON a.attrelid = ad.adrelid AND a.attnum = ad.adnum
      WHERE
        a.attnum > 0 AND NOT a.attisdropped
        AND n.nspname NOT IN ('pg_catalog', 'information_schema')
        AND cl.relkind = 'r' 
    )
    SELECT
      schema_name,
      table_name,
      json_agg(
        json_build_object(
          'column_name', column_name,
          'data_type', data_type,
          'is_primary', is_primary,
          'is_unique', is_unique,
          'default_value', default_value,
          'is_nullable', is_nullable,
          'foreign_table', foreign_table,
          'enum_labels', enum_labels
        ) order by column_order
      ) AS columns
    FROM
      table_columns
    WHERE schema_name = 'public'
      AND NOT table_name LIKE '_prisma_%'
    GROUP BY
      schema_name, table_name
    ORDER BY
      table_name;     
`;

    const tables: TableDetailsModel[] = await this.prisma.$queryRawUnsafe(
      query
    );
    return tables.map((table) => ({
      table_name: table.table_name,
      columns: table.columns.map((column) => ({
        column_name: column.column_name,
        data_type: column.data_type,
        is_primary: column.is_primary,
        is_unique: column.is_unique,
        default_value: column.default_value,
        foreign_key: column.foreign_key,
        is_nullable: column.is_nullable,
        foreign_table: column.foreign_table,
        enum_labels: column.enum_labels,
      })),
    }));
  }

  private async findHeaderByName(
    tableName: string
  ): Promise<SearchHeaderColumnModel[]> {
    try {
      const columns = await this.prisma.$queryRaw<SearchHeaderColumnModel[]>`
        SELECT c.column_name, c.data_type, 
          CASE WHEN c.data_type = 'USER-DEFINED' 
            THEN (SELECT string_agg(enumlabel, ', ') FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = c.udt_name) 
            ELSE NULL END AS enum_labels
        FROM information_schema.columns c
        LEFT JOIN pg_type pt ON pt.typname = c.udt_name
        WHERE c.table_name = ${tableName}
        AND c.table_schema = 'public'
        ORDER BY c.ordinal_position;
      `;
      return columns;
    } catch (error: unknown) {
      const message = (error as Error).message || "An unknown error occurred";
      throw new Error(
        `Failed to fetch header information for table ${tableName}: ${message}`
      );
    }
  }

  async getTableInfo(
    context: ServiceContext,
    tableName: string,
    conditions: Record<string, any>,
    sort: string | undefined,
    direction: string | undefined
  ): Promise<SearchTableDetailsModel> {
    const headers = await this.findHeaderByName(tableName);
    if (!headers) {
      throw new NotFoundError("Headers not found");
    }

    const convertedConditions = this.convertFilterConditions(
      conditions,
      headers
    );
    const sortConfig = sort && direction ? { key: sort, direction } : undefined;

    const data = await this.findBy(
      tableName,
      headers,
      convertedConditions,
      sortConfig
    );
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    return { headers, data };
  }

  private async findBy(
    tableName: string,
    headers: SearchHeaderColumnModel[],
    conditions: Record<string, any>,
    sortConfig?: { key: string; direction: string }
  ): Promise<Record<string, string>[]> {
    try {
      let query = `SELECT * FROM "${tableName}"`;

      if (Object.keys(conditions).length > 0) {
        const whereClauses = headers
          .map((header) => {
            const value = conditions[header.column_name];
            if (!value) return "";

            if (header.data_type === "enum" && header.enum_labels) {
              return `"${header.column_name}" = '${value}'`;
            } else if (header.data_type === "jsonb") {
              return `to_tsvector("${header.column_name}") @@ to_tsquery('${value}')`;
            } else if (["integer", "numeric"].includes(header.data_type)) {
              return `CAST("${header.column_name}" AS TEXT) ILIKE '%${value}%'`;
            } else if (header.data_type.includes("timestamp")) {
              return `CAST("${header.column_name}" AS TEXT) ILIKE '%${value}%'`;
            } else {
              return `"${header.column_name}" ILIKE '%${value}%'`;
            }
          })
          .filter((clause) => clause.length > 0)
          .join(" AND ");

        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses}`;
        }
      }

      if (sortConfig) {
        query += ` ORDER BY "${sortConfig.key}" ${sortConfig.direction}`;
      }

      const results = await this.prisma.$queryRaw<Record<string, any>[]>`
        ${Prisma.raw(query)}
      `;

      return results.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key, value])
        )
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      throw new Error(
        `Failed to fetch data for table ${tableName}: ${message}`
      );
    }
  }

  private convertFilterConditions(
    conditions: Record<string, any>,
    headers: SearchHeaderColumnModel[]
  ): Record<string, any> {
    const convertedConditions: Record<string, any> = {};

    Object.entries(conditions).forEach(([columnName, rawValue]) => {
      const columnInfo = headers.find(
        (header) => header.column_name === columnName
      );
      if (!columnInfo) return;

      if (!rawValue) return;

      let value = rawValue;
      if (typeof rawValue === "string") {
        value = rawValue.trim();
        if (value === "") return;
      }

      switch (columnInfo.data_type) {
        case "integer":
          value = parseInt(value, 10);
          if (isNaN(value)) {
            throw new Error(
              `Invalid integer format for column '${columnName}'.`
            );
          }
        case "timestamp without time zone":
          break;
        case "text":
          break;
        default:
          break;
      }

      convertedConditions[columnName] = value;
    });
    return convertedConditions;
  }
}
