import type { UserQueryService } from "@/app/services/query/user";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
export class GetMyProfileUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService
  ) {}

  execute(context: ServiceContext) {
    return queryServiceOperation(
      this.userQueryService.getUserById(context, context.userId)
    );
  }
}
