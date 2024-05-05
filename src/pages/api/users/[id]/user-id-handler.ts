import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "../../api-handler";
import { container } from "@/container";
import { GetUserUseCase } from "@/app/usecases/user/getUserUseCase";
import { ServiceContext } from "@/types/shared/service-context";
import { UpdateUserUseCase } from "@/app/usecases/user/updateUserUseCase";

class UserIdHandler extends AuthenticatedApiHandler {
  constructor(
    private getUserUseCase = container.get(GetUserUseCase),
    private updateUserUseCase = container.get(UpdateUserUseCase)
  ) {
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

  protected async handlePut(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { id } = req.query;
    const parsedId = parseInt(id as string);
    const { firstName, lastName, email, gender, birthdate } = req.body.formData;
    return (
      await this.updateUserUseCase.execute(context, {
        id: parsedId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        birthDay: birthdate,
        email: email,
      })
    ).toResponse(res);
  }
}

export const apiHanlder = new UserIdHandler();
