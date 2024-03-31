import { UserRepository } from "@/repositories/users/user-repository";
import { generateHash, generateRandomString } from "@/utils/crypt";
import { BadRequestError, NotFoundError } from "@/errors";
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
    username: string,
    email: string,
    gender: string,
    birthdate: Date
  ) {
    return commandServiceOperation(async () => {
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      if (existingUser.email !== email) {
        const emailAlreadyRegistered = await UserRepository.findByEmail(email);
        if (emailAlreadyRegistered) {
          throw new BadRequestError("Email already registered.");
        }
      }

      const profileData = {
        name: username,
        birth_date: new Date(birthdate),
        gender: gender,
      };
      const authorizationData = {
        auth_id: email,
        password_hash: existingUser.password_hash,
      };
      const contactData = {
        email: email,
      };

      return UserRepository.update(
        id,
        profileData,
        authorizationData,
        contactData
      );
    }, "Users successfully updated.");
  },
  async create(
    username: string,
    email: string,
    password: string,
    gender: string,
    birthdate: Date
  ) {
    return commandServiceOperation(async () => {
      const passwordHash = await generateHash(password);
      const profileData = {
        name: username,
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
    }, "Users successfully deleted.");
  },
  async getUserBySearchTerm(searchTerm: string | undefined) {
    return queryServiceOperation(
      UserRepository.findByNameAndEmail(searchTerm, searchTerm)
    );
  },
};
