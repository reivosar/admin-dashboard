import { UserRepository } from "@/repositories/users/user-repository";
import { generateHash, generateRandomString } from "@/utils/crypt";
import { BadRequestError, NotFoundError, ConflictError } from "@/errors";
import {
  commandServiceOperation,
  queryServiceOperation,
} from "../service-helper";

export const UserService = {
  async getUser(id: number) {
    return queryServiceOperation(UserRepository.findById(id));
  },
  async update(
    id: number,
    first_name?: string,
    last_name?: string,
    email?: string,
    gender?: string,
    birth_date?: Date
  ) {
    return commandServiceOperation(async () => {
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      if (email && email !== existingUser.email) {
        const emailExists = await UserRepository.findByEmail(email);
        if (emailExists) {
          throw new ConflictError("Email already registered");
        }
      }

      const needsUpdate = {
        profile:
          first_name !== undefined ||
          last_name !== undefined ||
          birth_date !== undefined ||
          gender !== undefined,
        authorization: email !== undefined,
        contact: email !== undefined,
      };

      const profileData = needsUpdate.profile
        ? {
            first_name: first_name ?? existingUser.first_name ?? "",
            last_name: last_name ?? existingUser.last_name ?? "",
            birth_date: birth_date
              ? new Date(birth_date)
              : existingUser.birth_date ?? "",
            gender: gender ?? existingUser.gender ?? "",
          }
        : undefined;

      const authorizationData = needsUpdate.authorization
        ? {
            auth_id: email ?? "",
            password_hash: existingUser.password_hash,
          }
        : undefined;

      const contactData = needsUpdate.contact
        ? {
            email: email ?? "",
          }
        : undefined;

      return await UserRepository.update(
        id,
        profileData,
        authorizationData,
        contactData
      );
    }, "User successfully updated.");
  },
  async create(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    gender: string,
    birthdate: Date
  ) {
    return commandServiceOperation(async () => {
      const emailAlreadyRegistered = await UserRepository.findByEmail(email);
      if (emailAlreadyRegistered) {
        throw new BadRequestError("Email already registered.");
      }

      const passwordHash = await generateHash(password);
      const profileData = {
        first_name: first_name,
        last_name: last_name,
        birth_date: new Date(birthdate),
        gender: gender,
      };
      const authorizationData = {
        auth_id: email,
        password_hash: passwordHash,
      };
      const contactData = {
        email: email,
      };
      const activation_code = generateRandomString();
      const expires_at = new Date();
      expires_at.setHours(expires_at.getHours() + 24);
      const userActivationCode = { activation_code, expires_at };

      return UserRepository.create(
        profileData,
        authorizationData,
        contactData,
        userActivationCode
      );
    }, "User successfully created.");
  },
  async delete(userIds: number[]) {
    return commandServiceOperation(async () => {
      UserRepository.delete(userIds);
    });
  },
  async getUserBySearchTerm(searchTerm: string | undefined) {
    return queryServiceOperation(
      UserRepository.findByNameAndEmail(searchTerm, searchTerm)
    );
  },
};
