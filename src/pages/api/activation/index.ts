import type { NextApiRequest, NextApiResponse } from "next";
import { activationHandler } from "./activation-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return activationHandler.handleRequest(req, res);
}
