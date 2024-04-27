import type { UserQueryService } from "@/app/services/query/user";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

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
    return queryServiceOperation(
      this.userQueryService.getUsersBySearchTerm(context, request.searchTerm)
    );
  }
}
