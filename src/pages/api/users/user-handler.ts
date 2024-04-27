import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/app/services/users/user-service";
import { AuthenticatedApiHandler } from "../api-handler";
import { container } from "@/container";
import { CreateUserUseCase } from "@/app/usecases/user/createUserUseCase";
import { ServiceContext } from "@/types/shared/service-context";
import { DeleteUserUseCase } from "@/app/usecases/user/deleteUserUseCase";
import { GetUserUseCase } from "@/app/usecases/user/getUserUseCase";
import { GetUsersBySearchTermUseCase } from "@/app/usecases/user/getUsersBySearchTermUseCase";

class UserHandler extends AuthenticatedApiHandler {
  constructor(
    private getUsersBySearchTermUseCase = container.get(
      GetUsersBySearchTermUseCase
    ),
    private createUserUseCase = container.get(CreateUserUseCase),
    private deleteUserUseCase = container.get(DeleteUserUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const searchQuery = req.query["filter[searchTerm]"] as string | undefined;
    return (
      await this.getUsersBySearchTermUseCase.execute(context, {
        searchTerm: searchQuery,
      })
    ).toResponse(res);
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { firstName, lastName, email, password, gender, birthdate } =
      req.body;
    return (
      await this.createUserUseCase.execute(context, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        gender: gender,
        birthDay: birthdate,
      })
    ).toResponse(res);
  }

  protected async handleDelete(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid request data." });
    }
    return (
      await this.deleteUserUseCase.execute(context, { userIds })
    ).toResponse(res);
  }
}

export const apiHanlder = new UserHandler();
