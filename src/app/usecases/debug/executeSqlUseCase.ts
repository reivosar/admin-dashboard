import type { ExecuteSqlQueryService } from "@/app/services/query/debug/db/sql";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

export interface ExecuteSqlUseCaseQuery {
  sql: string;
}

@injectable()
export class ExecuteSqlUseCase {
  constructor(
    @inject("ExecuteSqlQueryService")
    private executeSqlQueryService: ExecuteSqlQueryService
  ) {}

  execute(context: ServiceContext, request: ExecuteSqlUseCaseQuery) {
    return queryUseCaseOperation(
      this.executeSqlQueryService.executeSql(context, request.sql)
    );
  }
}
