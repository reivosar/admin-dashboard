import type { NextApiRequest, NextApiResponse } from "next";
import { LoginService } from "@/services/login/login-service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return handlePost(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  return (await LoginService.login(email, password)).toResponse(res);
}
