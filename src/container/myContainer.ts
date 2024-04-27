import { GetMyProfileUseCase } from "@/app/usecases/my/getMyProfileUseCase";
import { UpdateMyContractUseCase } from "@/app/usecases/my/updateMyContractUsecase";
import { UpdateMyProfileUseCase } from "@/app/usecases/my/updateMyProfileUsecase";
import { UpdatePasswordUseCase } from "@/app/usecases/my/updatePasswordUsecase";
import { Container } from "inversify";

export const MyContainer = {
  dependencyInjecton(container: Container) {
    // UseCase
    container.bind(GetMyProfileUseCase).toSelf();
    container.bind(UpdateMyContractUseCase).toSelf();
    container.bind(UpdateMyProfileUseCase).toSelf();
    container.bind(UpdatePasswordUseCase).toSelf();
  },
};
