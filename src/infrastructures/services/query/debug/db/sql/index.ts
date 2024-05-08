import { ExecuteSqlQueryService } from "@/app/services/query/debug/db/sql";
import { TYPES } from "@/container/types";
import { ExecuteSQLResultType, TableDetailsModel } from "@/types/debug";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaExecuteSqlQueryService implements ExecuteSqlQueryService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async executeSql(
    context: ServiceContext,
    sql: string
  ): Promise<ExecuteSQLResultType> {
    try {
      const processedSql = this.autoQuoteIdentifiersEnhanced(sql);

      const results = (await this.prisma.$queryRawUnsafe(
        processedSql
      )) as Record<string, any>[];

      if (results.length === 0) {
        return { headers: [], data: [] };
      }
      const headers = Object.keys(results[0]);
      const data = results.map((row) =>
        headers.reduce((acc, header) => ({ ...acc, [header]: row[header] }), {})
      );
      return {
        headers,
        data,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      throw new Error(`Failed to execute SQL query: ${message}`);
    }
  }

  private autoQuoteIdentifiersEnhanced(sql: string): string {
    return sql;
  }
}
