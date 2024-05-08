import type { UserQueryService } from "@/app/services/query/user";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

@injectable()
export class GetMyProfileUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService
  ) {}

  execute(context: ServiceContext) {
    return queryUseCaseOperation(
      this.userQueryService.getUserById(context, context.userId)
    );
  }
}
