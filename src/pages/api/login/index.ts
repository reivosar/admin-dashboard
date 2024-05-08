import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "./login-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler.handleRequest(req, res);
}
