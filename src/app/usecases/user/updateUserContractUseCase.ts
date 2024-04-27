import { AuthId } from "@/app/domain/models/user/authorization/authid";
import { Email } from "@/app/domain/models/user/contact/email";
import { UserId } from "@/app/domain/models/user/userId";
import type { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import type { UserContractRepository } from "@/app/domain/repositories/user/contract";
import type { UserQueryService } from "@/app/services/query/user";
import { ServiceContext } from "@/types/shared/service-context";
import { ConflictError, NotFoundError } from "@/utils/errors";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import "reflect-metadata";

export interface UpdateUserContractUseCaseCommand {
  id: number;
  email?: string;
}

@injectable()
export class UpdateUserContractUseCase {
  constructor(
    @inject("UserQueryService")
    private userQueryService: UserQueryService,
    @inject("UserContractRepository")
    private userContractRepository: UserContractRepository,
    @inject("UserAuthorizationRepository")
    private userAuthorizationRepository: UserAuthorizationRepository
  ) {}

  async execute(
    context: ServiceContext,
    request: UpdateUserContractUseCaseCommand
  ) {
    return commandUseCaseOperation(async () => {
      const existingUser = await this.userQueryService.getUserById(
        context,
        request.id
      );
      if (!existingUser) {
        throw new NotFoundError("User not found");
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
