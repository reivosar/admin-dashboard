import { UserRepository } from "@/repositories/users/user-repository";
import { UserTokenRepository } from "@/repositories/users/user-token-repository";
import { queryServiceOperation } from "@/services/service-helper";
import { NotFoundError } from "@/errors";

export const MyProfileService = {
  async getProfile(token: string) {
    return queryServiceOperation(
      new Promise(async (resolve, reject) => {
        try {
          const userId = await UserTokenRepository.findUserIdBy(token);
          if (!userId) {
            throw new NotFoundError("User not found");
          }
          const user = await UserRepository.findById(userId);
          if (!user) {
            throw new NotFoundError("User profile not found");
          }
          resolve(user);
        } catch (error) {
          reject(error);
        }
      })
    );
  },
};
