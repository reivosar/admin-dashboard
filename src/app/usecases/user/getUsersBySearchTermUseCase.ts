import type { UserQueryService } from "@/app/services/query/user";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

export interface GetUsersBySearchTermUseCaseQuery {
  searchTerm: string | undefined;
}

@injectable()
export class GetUsersBySearchTermUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService
  ) {}

  execute(context: ServiceContext, request: GetUsersBySearchTermUseCaseQuery) {
    return queryUseCaseOperation(
      this.userQueryService.getUsersBySearchTerm(context, request.searchTerm)
    );
  }
}
