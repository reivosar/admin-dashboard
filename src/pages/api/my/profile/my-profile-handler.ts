import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "../../api-handler";
import { container } from "@/container";
import { GetMyProfileUseCase } from "@/app/usecases/my/getMyProfileUseCase";
import { ServiceContext } from "@/types/shared/service-context";

class MyProfileHandler extends AuthenticatedApiHandler {
  constructor(
    private getMyProfileUseCase = container.get(GetMyProfileUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    return (await this.getMyProfileUseCase.execute(context)).toResponse(res);
  }
}

export const apiHandler = new MyProfileHandler();
