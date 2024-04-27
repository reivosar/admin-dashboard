import type { UserProfileRepository } from "@/app/domain/repositories/user/profile";
import { UserId } from "@/app/domain/models/user/userId";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import { NotFoundError } from "@/utils/errors";
import "reflect-metadata";

export interface UpdateUserProfileUseCaseCommand {
  id: number;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDay?: Date;
}

@injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @inject("UserProfileRepository")
    private userProfileRepository: UserProfileRepository
  ) {}

  execute(context: ServiceContext, request: UpdateUserProfileUseCaseCommand) {
    return commandUseCaseOperation(async () => {
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
          throw new NotFoundError("User not found");
        }

        await this.userProfileRepository.save(
          context,
          userProfile
            .changeUserName(request.firstName, request.lastName)
            .changeBirthDay(request.birthDay)
            .changeGender(request.gender)
        );
      }
    });
  }
}
