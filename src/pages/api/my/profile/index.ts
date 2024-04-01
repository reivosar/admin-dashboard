import type { NextApiRequest, NextApiResponse } from "next";
import { MyProfileService } from "@/services/my/profile";
import { getTokenFromCookie } from "../../utils/cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({
      message: "Authorization failed: Token is required but was not provided.",
    });
  }
  return (await MyProfileService.getProfile(token)).toResponse(res);
}
