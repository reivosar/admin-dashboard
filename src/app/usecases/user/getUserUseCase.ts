import type { UserQueryService } from "@/app/services/query/user";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

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
    return queryUseCaseOperation(
      this.userQueryService.getUserById(context, request.userId)
    );
  }
}
