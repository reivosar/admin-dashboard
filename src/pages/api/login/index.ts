import { LoginService } from "@/services/login/login-service";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return login(req, res);
}

async function login(req: NextApiRequest, res: NextApiResponse) {
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
