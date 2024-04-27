import type { UserTokenRepository } from "@/app/domain/repositories/user/token";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import { UserId } from "@/app/domain/models/user/userId";
import "reflect-metadata";

@injectable()
export class LogoutUseCase {
  constructor(
    @inject("UserTokenRepository")
    private userTokenRepository: UserTokenRepository
  ) {}

  async execute(context: ServiceContext) {
    return commandUseCaseOperation(async () => {
      await this.userTokenRepository.delete(new UserId(context.userId));
    });
  }
}
