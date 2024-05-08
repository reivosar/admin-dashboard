import type { DatabaseTableQueryService } from "@/app/services/query/debug/db/tables";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

export interface GetTableInfoUseCaseQuery {
  tableName: string;
  conditions: Record<string, any>;
  sort: string | undefined;
  direction: string | undefined;
}

@injectable()
export class GetTableInfoUseCase {
  constructor(
    @inject("DatabaseTableQueryService")
    private databaseTableQueryService: DatabaseTableQueryService
  ) {}

  execute(context: ServiceContext, request: GetTableInfoUseCaseQuery) {
    return queryUseCaseOperation(
      this.databaseTableQueryService.getTableInfo(
        context,
        request.tableName,
        request.conditions,
        request.sort,
        request.direction
      )
    );
  }
}
