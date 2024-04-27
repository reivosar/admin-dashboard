import type { DatabaseTableQueryService } from "@/app/services/query/debug/db/tables";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
export class GetAllTablesUseCase {
  constructor(
    @inject("DatabaseTableQueryService")
    private databaseTableQueryService: DatabaseTableQueryService
  ) {}

  execute(context: ServiceContext) {
    return queryServiceOperation(
      this.databaseTableQueryService.getAllTables(context)
    );
  }
}
