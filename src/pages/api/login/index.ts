import { NextApiRequest, NextApiResponse } from "next";
import { apiHander } from "./login-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHander.handleRequest(req, res);
}
