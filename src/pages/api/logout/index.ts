import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "./logout-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler.handleRequest(req, res);
}
