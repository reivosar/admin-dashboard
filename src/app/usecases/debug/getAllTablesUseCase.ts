import type { DatabaseTableQueryService } from "@/app/services/query/debug/db/tables";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

@injectable()
export class GetAllTablesUseCase {
  constructor(
    @inject("DatabaseTableQueryService")
    private databaseTableQueryService: DatabaseTableQueryService
  ) {}

  execute(context: ServiceContext) {
    return queryUseCaseOperation(
      this.databaseTableQueryService.getAllTables(context)
    );
  }
}
