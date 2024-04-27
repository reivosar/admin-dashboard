import { AuthId } from "@/app/domain/models/user/authorization/authid";
import { UserToken } from "@/app/domain/models/user/token";
import type { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import type { UserActivationRepository } from "@/app/domain/repositories/user/activation";
import type { UserTokenRepository } from "@/app/domain/repositories/user/token";
import { ServiceContext } from "@/types/shared/service-context";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import { injectable, inject } from "inversify";
import { sign } from "@/utils/jwt";
import { commandUseCaseOperation } from "../usecaseHelper";
import { Expire } from "@/app/domain/models/shared/expire";
import { TokenHash } from "@/app/domain/models/user/token/tokenHash";
import { log } from "console";
import "reflect-metadata";

export interface LoginUseCaseCommnd {
  authId: string;
  password: string;
}

@injectable()
export class LoginUseCase {
  constructor(
    @inject("UserAuthorizationRepository")
    private userAuthorizationRepository: UserAuthorizationRepository,
    @inject("UserActivationRepository")
    private userActivationRepository: UserActivationRepository,
    @inject("UserTokenRepository")
    private userTokenRepository: UserTokenRepository
  ) {}

  async execute(context: ServiceContext, request: LoginUseCaseCommnd) {
    return commandUseCaseOperation(async () => {
      const authId = new AuthId(request.authId);
      const loginInfo = await this.userAuthorizationRepository.findByAuthId(
        authId
      );
      if (!loginInfo) {
        throw new NotFoundError("Account not found.");
      }
      if (!loginInfo.verifyPassword(request.password)) {
        throw new NotFoundError("Invalid password.");
      }

      const userActivation = await this.userActivationRepository.findById(
        loginInfo.getUserId()
      );
      if (!userActivation) {
        throw new UnauthorizedError(
          "Your account has not been activated yet. Please check your email for the activation link to complete the activation process."
        );
      }

      const token = sign({
        user_id: loginInfo.getUserId().asNumber(),
        loginDate: new Date().toISOString(),
      });

      const userToken = new UserToken(
        loginInfo.getUserId(),
        TokenHash.fromHashString(token),
        Expire.fromHours(24)
      );
      await this.userTokenRepository.save(context, userToken);

      return { token };
    });
  }
}
