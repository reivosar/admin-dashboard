import type { NextApiRequest, NextApiResponse } from "next";
import { apiHander } from "./table-list-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHander.handleRequest(req, res);
}
