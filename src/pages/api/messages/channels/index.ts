import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "./channels-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler.handleRequest(req, res);
}
