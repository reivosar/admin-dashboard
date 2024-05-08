import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "./auth-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler.handleRequest(req, res);
}
