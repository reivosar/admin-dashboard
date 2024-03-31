import { SqlService } from "@/services/debug/sql-service";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return handlePost(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "SQL query is required" });
  }
  return (await SqlService.exectueSql(query)).toResponse(res);
}
