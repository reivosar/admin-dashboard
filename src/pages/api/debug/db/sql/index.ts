import type { NextApiRequest, NextApiResponse } from "next";
import { apiHander } from "./sql-execute-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHander.handleRequest(req, res);
}
