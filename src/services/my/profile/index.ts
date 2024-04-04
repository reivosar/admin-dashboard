import { UserRepository } from "@/repositories/users/user-repository";
import { UserTokenRepository } from "@/repositories/users/user-token-repository";
import {
  commandServiceOperation,
  queryServiceOperation,
} from "@/services/service-helper";
import { NotFoundError } from "@/errors";
import { UserService } from "@/services/users/user-service";

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
  async update(
    token: string,
    section: string,
    first_name?: string,
    last_name?: string,
    email?: string,
    gender?: string,
    birth_date?: string
  ) {
    return commandServiceOperation(async () => {
      const userId = await UserTokenRepository.findUserIdBy(token);
      if (!userId) {
        throw new NotFoundError("User not found");
      }

      let updateData: { [key: string]: string } = {};
      switch (section) {
        case "name":
          updateData = {
            ...updateData,
            first_name: first_name ?? "",
            last_name: last_name ?? "",
          };
          break;
        case "email":
          updateData = { ...updateData, email: email ?? "" };
          break;
        case "gender":
          updateData = { ...updateData, gender: gender ?? "" };
          break;
        case "birthdate":
          updateData = { ...updateData, birth_date: birth_date ?? "" };
          break;
        default:
          throw new Error(`Unsupported section: ${section}`);
      }

      return await UserService.update(
        userId,
        updateData.first_name,
        updateData.last_name,
        updateData.email,
        updateData.gender,
        updateData.birth_date ? new Date(updateData.birth_date) : undefined
      );
    });
  },
};
