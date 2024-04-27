import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import { Email } from "@/app/domain/models/user/contact/email";
import type { UserFactory } from "@/app/domain/factories/user";
import { UserName } from "@/app/domain/models/user/profile/name";
import { Birthday } from "@/app/domain/models/user/profile/birthday";
import { PasswordHash } from "@/app/domain/models/user/authorization/passwordHash";
import { Gender } from "@/app/domain/models/user/profile/gender";
import "reflect-metadata";

export interface CreateUserUseCaseCommand {
  firstName: string;
  lastName: string;
  gender: string;
  birthDay: Date;
  password: string;
  email: string;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserFactory")
    private userFactory: UserFactory
  ) {}

  execute(context: ServiceContext, request: CreateUserUseCaseCommand) {
    return commandUseCaseOperation(async () => {
      const userName = new UserName(request.firstName, request.lastName);
      const email = new Email(request.email);
      const birthday = new Birthday(request.birthDay);
      const gender = new Gender(request.gender);
      const password = PasswordHash.createFromPlainText(request.password);

      await this.userFactory.create(
        context,
        userName,
        gender,
        birthday,
        email,
        password
      );
    });
  }
}
