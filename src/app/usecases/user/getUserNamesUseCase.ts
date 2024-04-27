import type { UserQueryService } from "@/app/services/query/user";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

export interface GetUserNamesUseCaseUseCase {
  searchTerm: string | undefined;
}

@injectable()
export class GetUserNamesUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService
  ) {}

  execute(context: ServiceContext, request: GetUserNamesUseCaseUseCase) {
    return queryServiceOperation(
      this.userQueryService.getUserNamesByName(context, request.searchTerm)
    );
  }
}
