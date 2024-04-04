import { LoginRepository } from "@/repositories/login/login-repository";
import { equals } from "@/utils/crypt";
import { commandServiceOperation } from "../service-helper";
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
} from "@/errors";
import { sign } from "@/pages/api/utils/jwt";
import { UserTokenRepository } from "@/repositories/users/user-token-repository";
import { UserRepository } from "@/repositories/users/user-repository";

export const LoginService = {
  async login(email: string, password: string) {
    return commandServiceOperation(async () => {
      const loginInfo = await LoginRepository.findyByEmail(email);
      if (!loginInfo) {
        throw new NotFoundError("Account not found.");
      }
      if (!equals(password, loginInfo.passsword_hash)) {
        throw new NotFoundError("Invalid password.");
      }

      const userInfo = await UserRepository.findById(loginInfo.user_id);
      if (!userInfo) {
        throw new NotFoundError("Account not found.");
      }
      if (!userInfo.activated_at) {
        throw new UnauthorizedError(
          "Your account has not been activated yet. Please check your email for the activation link to complete the activation process."
        );
      }

      const user_id = loginInfo.user_id;
      const loginDate = new Date();
      const payload = {
        user_id,
        loginDate: loginDate.toISOString(),
      };
      const token = sign(payload);
      const expiresAt = new Date(loginDate.getTime() + 1 * 24 * 60 * 60 * 1000);

      const result = await UserTokenRepository.create(
        user_id,
        token,
        expiresAt
      );
      if (!result) {
        throw new InternalServerError("Failed to create user token.");
      }

      return token;
    }, "Login successed.");
  },
};
