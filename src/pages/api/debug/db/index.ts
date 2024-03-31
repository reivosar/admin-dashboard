import type { NextApiRequest, NextApiResponse } from "next";
import { TablenService } from "@/services/debug/table-service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  return (await TablenService.getAllTables()).toResponse(res);
}
