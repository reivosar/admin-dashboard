import type { UserProfileRepository } from "@/app/domain/repositories/user/profile";
import type { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import type { UserContractRepository } from "@/app/domain/repositories/user/contract";
import type { UserQueryService } from "@/app/services/query/user";
import { UserId } from "@/app/domain/models/user/userId";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import { ConflictError, NotFoundError } from "@/utils/errors";
import "reflect-metadata";
import { AuthId } from "@/app/domain/models/user/authorization/authid";
import { Email } from "@/app/domain/models/user/contact/email";

export interface UpdateUserUseCaseCommand {
  id: number;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDay?: Date;
  email?: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService,
    @inject("UserProfileRepository")
    private userProfileRepository: UserProfileRepository,
    @inject("UserContractRepository")
    private userContractRepository: UserContractRepository,
    @inject("UserAuthorizationRepository")
    private userAuthorizationRepository: UserAuthorizationRepository
  ) {}

  execute(context: ServiceContext, request: UpdateUserUseCaseCommand) {
    return commandUseCaseOperation(async () => {
      const existingUser = await this.userQueryService.getUserById(
        context,
        request.id
      );
      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      if (
        request.firstName !== undefined ||
        request.lastName !== undefined ||
        request.birthDay !== undefined ||
        request.gender !== undefined
      ) {
        const userProfile = await this.userProfileRepository.findById(
          new UserId(request.id)
        );
        if (!userProfile) {
          throw new NotFoundError("User profile not found");
        }

        await this.userProfileRepository.save(
          context,
          userProfile
            .changeUserName(request.firstName, request.lastName)
            .changeBirthDay(request.birthDay)
            .changeGender(request.gender)
        );
      }

      if (request.email) {
        if (request.email !== existingUser.email) {
          const email = new Email(request.email);
          const emailExists = await this.userContractRepository.findByEmail(
            email
          );
          if (emailExists) {
            throw new ConflictError("Email already registered");
          }

          const userId = new UserId(request.id);
          const userContact = await this.userContractRepository.findById(
            userId
          );
          if (!userContact) {
            throw new NotFoundError("User contract not found");
          }
          await this.userContractRepository.save(
            context,
            userContact.changeEmail(email)
          );

          const userAuthorization =
            await this.userAuthorizationRepository.findById(userId);
          if (!userAuthorization) {
            throw new NotFoundError("User authorization not found");
          }
          await this.userAuthorizationRepository.save(
            context,
            userAuthorization.changeAuthId(new AuthId(request.email))
          );
        }
      }
    });
  }
}
