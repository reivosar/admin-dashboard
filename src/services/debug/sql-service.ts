import { SqlRepository } from "@/repositories/debug/sql-repository";
import { queryServiceOperation } from "../service-helper";

export const SqlService = {
  async exectueSql(sql: string) {
    return queryServiceOperation(SqlRepository.exectueSql(sql));
  },
};
