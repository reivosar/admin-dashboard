import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { AnonymousApiHandler } from "../api-handler";
import { LoginUseCase } from "@/app/usecases/user/loginUseCase";
import { container } from "@/container";
import { ServiceContext } from "@/types/shared/serviceContext";

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
      const serialized = serialize("authToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24,
        sameSite: "strict",
        path: "/",
      });
      res.setHeader("Set-Cookie", serialized);
    }
    return result.toResponse(res);
  }
}

export const apiHander = new LoginHandler();
