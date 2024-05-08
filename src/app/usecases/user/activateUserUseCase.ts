import { inject, injectable } from "inversify";
import { ActivationCode } from "@/app/domain/models/user/activationCode/activationCode";
import { AuthId } from "@/app/domain/models/user/authorization/authid";
import { UserActivation } from "@/app/domain/models/user/activation";
import type { UserActivationCodeRepository } from "@/app/domain/repositories/user/activationCode";
import type { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import type { UserActivationRepository } from "@/app/domain/repositories/user/activation";
import { ServiceContext } from "@/types/shared/serviceContext";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import { commandUseCaseOperation } from "../usecaseHelper";
import "reflect-metadata";

export interface ActivateUserUseCaseCommand {
  activationCode: string;
  email: string;
  password: string;
}

@injectable()
export class ActivateUserUseCase {
  constructor(
    @inject("UserActivationCodeRepository")
    private userActivationCodeRepository: UserActivationCodeRepository,
    @inject("UserAuthorizationRepository")
    private userAuthorizationRepository: UserAuthorizationRepository,
    @inject("UserActivationRepository")
    private userActivationRepository: UserActivationRepository
  ) {}

  async execute(context: ServiceContext, request: ActivateUserUseCaseCommand) {
    return commandUseCaseOperation(async () => {
      const userActivation =
        await this.userActivationCodeRepository.findByActivationCode(
          new ActivationCode(request.activationCode)
        );
      if (!userActivation) {
        throw new NotFoundError("Activation code not found.");
      }

      if (userActivation.hasExpired()) {
        throw new BadRequestError("Activation code has expired.");
      }

      const userAuthorization = await this.userAuthorizationRepository.findById(
        userActivation.getUserId()
      );
      if (!userAuthorization) {
        throw new NotFoundError("User not found.");
      }

      const passwordValid = await userAuthorization.verifyPassword(
        request.password
      );
      if (
        !userAuthorization.verifyAuthId(new AuthId(request.email)) ||
        !passwordValid
      ) {
        throw new BadRequestError("Invalid email or password.");
      }

      await this.userActivationRepository.save(
        context,
        new UserActivation(userActivation.getUserId())
      );
    });
  }
}
