import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "../api-handler";
import { container } from "@/container";
import { ServiceContext } from "@/types/shared/serviceContext";
import { clearAuthToken } from "@/utils/cookie";
import { LogoutUseCase } from "@/app/usecases/user/logoutUseCase";

class LogoutHandler extends AuthenticatedApiHandler {
  constructor(private logoutUseCase = container.get(LogoutUseCase)) {
    super();
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    res.setHeader("Set-Cookie", clearAuthToken());
    const result = await this.logoutUseCase.execute(context);
    return result.toResponse(res);
  }
}

export const apiHandler = new LogoutHandler();
