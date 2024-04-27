import { ExecuteSqlQueryService } from "@/app/services/query/debug/db/sql";
import { DatabaseTableQueryService } from "@/app/services/query/debug/db/tables";
import { ExecuteSqlUseCase } from "@/app/usecases/debug/executeSqlUseCase";
import { GetAllTablesUseCase } from "@/app/usecases/debug/getAllTablesUseCase";
import { GetTableInfoUseCase } from "@/app/usecases/debug/getTableInfoUseCase";
import { PrismaExecuteSqlQueryService } from "@/infrastructures/query/debug/db/sql";
import { PrismaDatabaseTableQueryService } from "@/infrastructures/query/debug/db/tables";
import { Container } from "inversify";

export const DebugContainer = {
  dependencyInjecton(container: Container) {
    // UseCase
    container.bind(ExecuteSqlUseCase).toSelf();
    container.bind(GetAllTablesUseCase).toSelf();
    container.bind(GetTableInfoUseCase).toSelf();

    // Query
    container
      .bind<DatabaseTableQueryService>("DatabaseTableQueryService")
      .to(PrismaDatabaseTableQueryService);
    container
      .bind<ExecuteSqlQueryService>("ExecuteSqlQueryService")
      .to(PrismaExecuteSqlQueryService);
  },
};
