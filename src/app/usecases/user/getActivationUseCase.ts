import type { UserQueryService } from "@/app/services/query/user";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

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
    return queryUseCaseOperation(
      this.userQueryService.getActivationUserByActivationCode(
        context,
        request.activationCode
      )
    );
  }
}
