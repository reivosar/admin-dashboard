import { TableRepository } from "@/repositories/debug/table-repository";
import { NotFoundError } from "@/errors";
import { SearchHeaderColumnModel } from "@/types/debug";
import { queryServiceOperation } from "../service-helper";

export const TablenService = {
  async getAllTables() {
    return queryServiceOperation(TableRepository.findAllTables());
  },
  async getTableInfo(
    table_name: string,
    conditions: Record<string, any>,
    sort: string | undefined,
    direction: string | undefined
  ) {
    return queryServiceOperation(
      new Promise(async (resolve, reject) => {
        const headers = await TableRepository.findHeaderByName(table_name);
        if (!headers) {
          throw new NotFoundError("Headers not found");
        }

        const convertedConditions = convertFilterConditions(
          conditions,
          headers
        );
        const sortConfig =
          sort && direction ? { key: sort, direction } : undefined;

        const data = await TableRepository.findBy(
          table_name,
          convertedConditions,
          sortConfig
        );
        if (!data) {
          throw new NotFoundError("Data not found");
        }

        resolve({ headers, data });
      }),
      "Data fetched successfully"
    );
  },
};

function convertFilterConditions(
  conditions: Record<string, any>,
  headers: SearchHeaderColumnModel[]
) {
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
          throw new Error(`Invalid integer format for column '${columnName}'.`);
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
