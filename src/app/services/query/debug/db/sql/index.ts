import { ExecuteSQLResultType, TableDetailsModel } from "@/types/debug";
import { ServiceContext } from "@/types/shared/service-context";

export interface ExecuteSqlQueryService {
  executeSql(
    context: ServiceContext,
    sql: string
  ): Promise<ExecuteSQLResultType>;
}
