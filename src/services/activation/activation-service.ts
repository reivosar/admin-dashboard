import { ActivationRepository } from "@/repositories/activation/activation-repository";
import {
  commandServiceOperation,
  queryServiceOperation,
} from "../service-helper";
import { equals } from "@/utils/crypt";
import { BadRequestError, NotFoundError } from "@/errors";

export const ActivationService = {
  async getActivation(activation_code: string) {
    return queryServiceOperation(
      ActivationRepository.findActivationCodeWithAuthorization(activation_code)
    );
  },

  async activate(activation_code: string, email: string, password: string) {
    return commandServiceOperation(async () => {
      const activationUser =
        await ActivationRepository.findActivationCodeWithAuthorization(
          activation_code
        );
      if (!activationUser) {
        throw new NotFoundError("Activation code not found.");
      }

      const now = new Date();
      const expiresAt = new Date(activationUser.expires_at);
      if (expiresAt < now) {
        throw new BadRequestError("Activation code has expired.");
      }

      const authIdEquals = email === activationUser.auth_id;
      const passwordEquals = await equals(
        password,
        activationUser.password_hash
      );
      if (!authIdEquals || !passwordEquals) {
        throw new BadRequestError("Invalid email or password.");
      }

      ActivationRepository.activate(activationUser.user_id, activation_code);
    });
  },
};
