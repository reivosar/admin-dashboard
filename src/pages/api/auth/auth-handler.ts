import type { NextApiRequest, NextApiResponse } from "next";
import { AnonymousApiHandler } from "../api-handler";
import { ServiceContext } from "@/types/shared/serviceContext";
import { ApiResult } from "@/app/appResult";
import { getUserIdFromCookie } from "@/utils/cookie";
import { AuthCheckUseCase } from "@/app/usecases/user/authCheckUseCase";
import { container } from "@/container";
import { UnauthorizedError } from "@/utils/errors";

class AuthHandler extends AnonymousApiHandler {
  constructor(private authCheckUseCase = container.get(AuthCheckUseCase)) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    try {
      const userId = getUserIdFromCookie(req);
      const result = await this.authCheckUseCase.execute(context, userId);
      if (!result) {
        throw new UnauthorizedError("Auth check error has ocurred.");
      }
      return new ApiResult<boolean>(true, undefined).toResponse(res);
    } catch (error) {
      return new ApiResult<boolean>(false, error).toResponse(res);
    }
  }
}

export const apiHandler = new AuthHandler();
