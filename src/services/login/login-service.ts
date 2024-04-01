import { LoginRepository } from "@/repositories/login/login-repository";
import { equals } from "@/utils/crypt";
import { commandServiceOperation } from "../service-helper";
import { NotFoundError, InternalServerError } from "@/errors";
import { sign } from "@/pages/api/utils/jwt";
import { UserTokenRepository } from "@/repositories/users/user-token-repository";

export const LoginService = {
  async login(email: string, password: string) {
    return commandServiceOperation(async () => {
      const loginInfo = await LoginRepository.findyByEmail(email);
      if (!loginInfo) {
        throw new NotFoundError("User not found.");
      }
      if (!equals(password, loginInfo.passsword_hash)) {
        throw new NotFoundError("Invalid password.");
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
