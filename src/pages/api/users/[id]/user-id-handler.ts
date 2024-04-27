import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/app/services/users/user-service";
import { AuthenticatedApiHandler } from "../../api-handler";
import { container } from "@/container";
import { GetUserUseCase } from "@/app/usecases/user/getUserUseCase";
import { ServiceContext } from "@/types/shared/service-context";
import { UpdateUserProfileUseCase } from "@/app/usecases/user/updateUserProfileUseCase";

class UserIdHandler extends AuthenticatedApiHandler {
  constructor(private getUserUseCase = container.get(GetUserUseCase)) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { id } = req.query;
    const parsedId = parseInt(id as string);
    return (
      await this.getUserUseCase.execute(context, { userId: parsedId })
    ).toResponse(res);
  }

  protected async handlePut(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const parsedId = parseInt(id as string);
    const { firstName, lastName, email, gender, birthdate } = req.body.formData;
    return (
      await UserService.update(
        parsedId,
        firstName,
        lastName,
        email,
        gender,
        birthdate
      )
    ).toResponse(res);
  }
}

export const apiHanlder = new UserIdHandler();
