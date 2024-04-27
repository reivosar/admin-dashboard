import type { UserQueryService } from "@/app/services/query/user";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

export interface GetUserUseCaseQuery {
  userId: number;
}

@injectable()
export class GetUserUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService
  ) {}

  execute(context: ServiceContext, request: GetUserUseCaseQuery) {
    return queryServiceOperation(
      this.userQueryService.getUserById(context, request.userId)
    );
  }
}
