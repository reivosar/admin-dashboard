import type { UserQueryService } from "@/app/services/query/user";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

export interface GetActivationUseCaseQuery {
  activationCode: string;
}

@injectable()
export class GetActivationUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService
  ) {}

  execute(context: ServiceContext, request: GetActivationUseCaseQuery) {
    return queryServiceOperation(
      this.userQueryService.getActivationUserByActivationCode(
        context,
        request.activationCode
      )
    );
  }
}
