import { LoginRepository } from "@/repositories/login/login-repository";
import { equals, generateRandomString } from "@/utils/crypt";
import { commandServiceOperation } from "../service-helper";
import { NotFoundError } from "@/errors";

export const LoginService = {
  async login(email: string, password: string) {
    return commandServiceOperation(async () => {
      // const password_hash = await LoginRepository.findyByEmail(email);
      // if (!password_hash) {
      //   throw new NotFoundError("User not found.");
      // }
      // if (!equals(password, password_hash)) {
      //   throw new NotFoundError("Invalid password.");
      // }
      return generateRandomString();
    }, "Login successed.");
  },
};
