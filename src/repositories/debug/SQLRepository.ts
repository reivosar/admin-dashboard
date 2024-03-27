import prisma from "../Prisma";
import { ExecuteSQLResultType } from "@/types/debug";

function autoQuoteIdentifiersEnhanced(sql: string): string {
  sql = sql.replace(/"/g, "");
  const pattern =
    /\b(FROM|JOIN|WHERE|ORDER\s+BY|GROUP\s+BY|AS|ON)\s+((?:\w+\.)?\w+)(\s+AS\s+\w+)?(\.\w+)?\b|\b(\w+\.\w+)\b/gi;

  let processedSql = sql.replace(
    pattern,
    (match, prefix, identifier, alias, columnName, rightSideIdentifier) => {
      if (rightSideIdentifier) {
        let [rightSchemaName, rightTableName] = rightSideIdentifier.includes(
          "."
        )
          ? rightSideIdentifier.split(".")
          : [null, rightSideIdentifier];
        return `"${rightSchemaName}"."${rightTableName}"`;
      }

      let [schemaName, tableName] = identifier?.includes(".")
        ? identifier.split(".")
        : [null, identifier];
      let quotedIdentifier = schemaName
        ? `"${schemaName}"."${tableName}"`
        : `"${tableName}"`;

      let quotedAlias = alias
        ? alias.toUpperCase().replace(/\s+AS\s+/i, ' AS "') + '"'
        : "";

      let quotedColumnName = columnName
        ? `."${columnName.replace(".", "")}"`
        : "";

      return `${prefix} ${quotedIdentifier}${quotedAlias}${quotedColumnName}`;
    }
  );

  if (!processedSql.trim().endsWith(";")) {
    processedSql += ";";
  }

  return processedSql;
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
