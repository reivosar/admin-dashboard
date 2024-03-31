import { ActivationService } from "@/services/activation/activation-service";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { code },
    method,
  } = req;

  if (typeof code !== "string" || !code) {
    return res.status(400).end(`Activaton code is required`);
  }
  return (await ActivationService.getActivation(code)).toResponse(res);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { activationCode, email, password } = req.body;

  if (!activationCode) {
    return res.status(400).json({ message: "Activaton code is required" });
  }

  return (
    await ActivationService.activate(activationCode, email, password)
  ).toResponse(res);
}
