import { UserId } from "@/app/domain/models/user/userId";
import type { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import { ServiceContext } from "@/types/shared/serviceContext";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import { PasswordHash } from "@/app/domain/models/user/authorization/passwordHash";
import "reflect-metadata";

export interface UpdateMyContractUseCaseCommand {
  oldPassword: string;
  newPassword: string;
}

@injectable()
export class UpdatePasswordUseCase {
  constructor(
    @inject("UserAuthorizationRepository")
    private userAuthorizationRepository: UserAuthorizationRepository
  ) {}

  async execute(
    context: ServiceContext,
    request: UpdateMyContractUseCaseCommand
  ) {
    return commandUseCaseOperation(async () => {
      const userId = new UserId(context.userId);
      const userAuthorization = await this.userAuthorizationRepository.findById(
        userId
      );
      if (!userAuthorization) {
        throw new NotFoundError("User authorization not found.");
      }

      if (!userAuthorization.verifyPassword(request.oldPassword)) {
        throw new BadRequestError("Invalid old password");
      }

      await this.userAuthorizationRepository.save(
        context,
        userAuthorization.changePasswordHash(
          PasswordHash.createFromPlainText(request.newPassword)
        )
      );
    });
  }
}
