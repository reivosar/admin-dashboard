import { SearchTableDetailsModel, TableDetailsModel } from "@/types/debug";
import { ServiceContext } from "@/types/shared/serviceContext";

export interface DatabaseTableQueryService {
  getAllTables(context: ServiceContext): Promise<TableDetailsModel[]>;

  getTableInfo(
    context: ServiceContext,
    tableName: string,
    conditions: Record<string, any>,
    sort: string | undefined,
    direction: string | undefined
  ): Promise<SearchTableDetailsModel>;
}
