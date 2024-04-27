import { UserFactory } from "@/app/domain/factories/user";
import { UserRepository } from "@/app/domain/repositories/user";
import { UserActivationRepository } from "@/app/domain/repositories/user/activation";
import { UserActivationCodeRepository } from "@/app/domain/repositories/user/activationCode";
import { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import { UserContractRepository } from "@/app/domain/repositories/user/contract";
import { UserProfileRepository } from "@/app/domain/repositories/user/profile";
import { UserTokenRepository } from "@/app/domain/repositories/user/token";
import { UserQueryService } from "@/app/services/query/user";
import { ActivateUserUseCase } from "@/app/usecases/user/activateUserUseCase";
import { CreateUserUseCase } from "@/app/usecases/user/createUserUseCase";
import { DeleteUserUseCase } from "@/app/usecases/user/deleteUserUseCase";
import { GetActivationUseCase } from "@/app/usecases/user/getActivationUseCase";
import { GetUsersBySearchTermUseCase } from "@/app/usecases/user/getUsersBySearchTermUseCase";
import { LoginUseCase } from "@/app/usecases/user/loginUseCase";
import { LogoutUseCase } from "@/app/usecases/user/logoutUseCase";
import { UpdateUserContractUseCase } from "@/app/usecases/user/updateUserContractUseCase";
import { UpdateUserProfileUseCase } from "@/app/usecases/user/updateUserProfileUseCase";
import { PrismaUserFactory } from "@/infrastructures/factory/user";
import { PrismaUserQueryService } from "@/infrastructures/query/user";
import { PrismaUserRepository } from "@/infrastructures/repositories/user";
import { PrismaUserActivationRepository } from "@/infrastructures/repositories/user/activation";
import { PrismaUserActivationCodeRepository } from "@/infrastructures/repositories/user/activationCode";
import { PrismaUserAuthorizationRepository } from "@/infrastructures/repositories/user/authorization";
import { PrismaUserContractRepository } from "@/infrastructures/repositories/user/contract";
import { PrismaUserProfileRepository } from "@/infrastructures/repositories/user/profile";
import { PrismaUserTokenRepository } from "@/infrastructures/repositories/user/token";
import { Container } from "inversify";

export const UserContainer = {
  dependencyInjecton(container: Container) {
    // UseCase
    container.bind(ActivateUserUseCase).toSelf();
    container.bind(CreateUserUseCase).toSelf();
    container.bind(DeleteUserUseCase).toSelf();
    container.bind(GetActivationUseCase).toSelf();
    container.bind(GetUsersBySearchTermUseCase).toSelf();
    container.bind(UpdateUserProfileUseCase).toSelf();
    container.bind(LoginUseCase).toSelf();
    container.bind(LogoutUseCase).toSelf();
    container.bind(UpdateUserContractUseCase).toSelf();
    container.bind(UpdateUserProfileUseCase).toSelf();

    // Factory
    container.bind<UserFactory>("UserFactory").to(PrismaUserFactory);

    // Query
    container
      .bind<UserQueryService>("UserQueryService")
      .to(PrismaUserQueryService);

    // Repository
    container
      .bind<UserActivationRepository>("UserActivationRepository")
      .to(PrismaUserActivationRepository);
    container
      .bind<UserActivationCodeRepository>("UserActivationCodeRepository")
      .to(PrismaUserActivationCodeRepository);
    container
      .bind<UserAuthorizationRepository>("UserAuthorizationRepository")
      .to(PrismaUserAuthorizationRepository);
    container
      .bind<UserContractRepository>("UserContractRepository")
      .to(PrismaUserContractRepository);
    container
      .bind<UserProfileRepository>("UserProfileRepository")
      .to(PrismaUserProfileRepository);
    container
      .bind<UserTokenRepository>("UserTokenRepository")
      .to(PrismaUserTokenRepository);
    container.bind<UserRepository>("UserRepository").to(PrismaUserRepository);
  },
};
