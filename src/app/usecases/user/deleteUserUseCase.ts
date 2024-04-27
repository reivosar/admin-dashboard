import { inject, injectable } from "inversify";
import type { UserRepository } from "@/app/domain/repositories/user";
import { UserId } from "@/app/domain/models/user/userId";
import { ServiceContext } from "@/types/shared/service-context";
import { commandUseCaseOperation } from "../usecaseHelper";
import "reflect-metadata";

export interface DeleteUserUseCaseCommand {
  userIds: number[];
}

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository
  ) {}

  async execute(context: ServiceContext, request: DeleteUserUseCaseCommand) {
    return commandUseCaseOperation(async () => {
      for (const userId of request.userIds) {
        await this.userRepository.delete(new UserId(userId));
      }
    });
  }
}
