import { APIHandler } from "../api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { LoginService } from "@/services/login/login-service";
import { serialize } from "cookie";

class LoginHandler extends APIHandler {
  protected async handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;

    const result = await LoginService.login(email, password);
    if (result.success && result.data) {
      const token = result.data;
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
