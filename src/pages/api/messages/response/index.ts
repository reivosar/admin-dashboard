import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "./response-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return apiHandler.handleRequest(req, res);
}
