import type { UserQueryService } from "@/app/services/query/user";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

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
    return queryUseCaseOperation(
      this.userQueryService.getUserNamesByName(context, request.searchTerm)
    );
  }
}
