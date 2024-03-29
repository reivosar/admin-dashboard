import { Prisma } from "@prisma/client";
import prisma from "../Prisma";
import { TableDetailsModel, SearchHeaderColumnModel } from "@/types/debug";

export const TableRepository = {
  async findAllTables(): Promise<TableDetailsModel[]> {
    const query = `
      WITH table_columns AS (
        SELECT
          t.table_schema,
          t.table_name,
          c.column_name,
          c.data_type,
          c.column_default,
          CASE
            WHEN c.is_nullable = 'YES' THEN TRUE
            ELSE FALSE
          END AS is_nullable,
          CASE
            WHEN pk.constraint_type = 'PRIMARY KEY' THEN TRUE
            ELSE FALSE
          END AS is_primary,
          CASE
            WHEN uq.constraint_type = 'UNIQUE' THEN TRUE
            ELSE FALSE
          END AS is_unique,
          fk.referenced_table_name AS foreign_table,
          COALESCE(
            (SELECT string_agg(e.enumlabel, ', ')
             FROM pg_enum e
             JOIN pg_type t ON e.enumtypid = t.oid
             WHERE t.typname = c.udt_name),
            ''
          ) AS enum_labels
        FROM
          information_schema.tables t
          JOIN information_schema.columns c ON t.table_schema = c.table_schema AND t.table_name = c.table_name
          LEFT JOIN (
            SELECT
              tc.table_schema,
              tc.table_name,
              ccu.column_name,
              tc.constraint_type
            FROM
              information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage ccu ON tc.constraint_schema = ccu.constraint_schema AND tc.constraint_name = ccu.constraint_name
            WHERE
              tc.constraint_type = 'PRIMARY KEY'
          ) pk ON t.table_schema = pk.table_schema AND t.table_name = pk.table_name AND c.column_name = pk.column_name
          LEFT JOIN (
            SELECT
              tc.table_schema,
              tc.table_name,
              ccu.column_name,
              tc.constraint_type
            FROM
              information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage ccu ON tc.constraint_schema = ccu.constraint_schema AND tc.constraint_name = ccu.constraint_name
            WHERE
              tc.constraint_type = 'UNIQUE'
          ) uq ON t.table_schema = uq.table_schema AND t.table_name = uq.table_name AND c.column_name = uq.column_name
          LEFT JOIN (
            SELECT
              kcu.table_schema,
              kcu.table_name,
              kcu.column_name,
              ccu.table_name AS referenced_table_name
            FROM
              information_schema.referential_constraints rc
              JOIN information_schema.key_column_usage kcu ON rc.constraint_schema = kcu.constraint_schema AND rc.constraint_name = kcu.constraint_name
              JOIN information_schema.constraint_column_usage ccu ON rc.unique_constraint_schema = ccu.constraint_schema AND rc.unique_constraint_name = ccu.constraint_name
          ) fk ON t.table_schema = fk.table_schema AND t.table_name = fk.table_name AND c.column_name = fk.column_name
        WHERE
          t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
          AND NOT t.table_name LIKE '_prisma_%'
        ORDER BY t.table_name, c.ordinal_position
      )
      SELECT
        tc.table_name,
        json_agg(
          json_build_object(
            'column_name', tc.column_name,
            'data_type', tc.data_type,
            'is_primary', tc.is_primary,
            'is_unique', tc.is_unique,
            'default_value', tc.column_default,
            'is_nullable', tc.is_nullable,
            'foreign_table', tc.foreign_table,
            'enum_labels', tc.enum_labels
          )
        ) AS columns
      FROM
        table_columns tc
      GROUP BY
        tc.table_schema, tc.table_name
      ORDER BY
        tc.table_name;
    `;

    const tables: TableDetailsModel[] = await prisma.$queryRawUnsafe(query);
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
  },

  async findHeaderByName(
    tableName: string
  ): Promise<SearchHeaderColumnModel[]> {
    try {
      const columns = await prisma.$queryRaw<SearchHeaderColumnModel[]>`
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
  },

  async findBy(
    tableName: string,
    conditions: Record<string, any>,
    sortConfig?: { key: string; direction: string }
  ): Promise<Record<string, string>[]> {
    try {
      let query = `SELECT * FROM "${tableName}"`;

      if (Object.keys(conditions).length > 0) {
        const whereClauses = Object.entries(conditions)
          .map(([key, value]) => `"${key}" = '${value}'`)
          .join(" AND ");
        query += ` WHERE ${whereClauses}`;
      }

      if (sortConfig) {
        query += ` ORDER BY "${sortConfig.key}" ${sortConfig.direction}`;
      }

      const results = await prisma.$queryRaw<Record<string, any>[]>`
        ${Prisma.raw(query)}
      `;

      return results.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key, value.toString()])
        )
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      throw new Error(
        `Failed to fetch data for table ${tableName}: ${message}`
      );
    }
  },
};
