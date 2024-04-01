import type { NextApiRequest, NextApiResponse } from "next";
import { apiHanlder } from "./user-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHanlder.handleRequest(req, res);
}
