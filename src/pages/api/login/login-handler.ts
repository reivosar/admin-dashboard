import type { NextApiRequest, NextApiResponse } from "next";
import { AnonymousApiHandler } from "../api-handler";
import { LoginUseCase } from "@/app/usecases/user/loginUseCase";
import { container } from "@/container";
import { ServiceContext } from "@/types/shared/serviceContext";
import { createSerializeAuthToken } from "@/utils/cookie";

class LoginHandler extends AnonymousApiHandler {
  constructor(private loginUseCase = container.get(LoginUseCase)) {
    super();
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { email, password } = req.body;

    const result = await this.loginUseCase.execute(context, {
      authId: email,
      password: password,
    });
    if (result.success && result.data) {
      const token = result.data.token;
      const serialized = createSerializeAuthToken(token);
      res.setHeader("Set-Cookie", serialized);
    }
    return result.toResponse(res);
  }
}

export const apiHandler = new LoginHandler();
