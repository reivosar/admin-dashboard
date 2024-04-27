import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "../../api-handler";
import { container } from "@/container";
import { GetUserNamesUseCase } from "@/app/usecases/user/getUserNamesUseCase";
import { ServiceContext } from "@/types/shared/service-context";

class UserNameHandler extends AuthenticatedApiHandler {
  constructor(
    private getUserNamesUseCase = container.get(GetUserNamesUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const searchQuery = req.query["name"] as string | undefined;
    return (
      await this.getUserNamesUseCase.execute(context, {
        searchTerm: searchQuery,
      })
    ).toResponse(res);
  }
}

export const apiHanlder = new UserNameHandler();
