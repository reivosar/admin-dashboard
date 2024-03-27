import { SQLRepository } from "@/repositories/debug/SQLRepository";
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
  return SQLRepository.findBy(query)
    .then((results) => {
      if (!results.data || results.data.length === 0) {
        return res.status(404).json({ message: "No tables found." });
      } else {
        return res.status(200).json(results);
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    });
}
