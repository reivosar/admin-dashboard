import prisma from "../Prisma";
import { ExecuteSQLResultType } from "@/types/debug";

function autoQuoteIdentifiersEnhanced(sql: string): string {
  return sql;
}

export const SQLRepository = {
  async findBy(sql: string): Promise<ExecuteSQLResultType> {
    try {
      const processedSql = autoQuoteIdentifiersEnhanced(sql);

      const results = (await prisma.$queryRawUnsafe(processedSql)) as Record<
        string,
        any
      >[];

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
  },
};
