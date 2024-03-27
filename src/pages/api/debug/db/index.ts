import type { NextApiRequest, NextApiResponse } from "next";
import { TableRepository } from "@/repositories/debug/TableRepository";

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
  return TableRepository.findAllTables()
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ message: "No tables found." });
      } else {
        return res.status(200).json(results);
      }
    })
    .catch(() => {
      return res.status(500).json({ message: "Internal Server Error" });
    });
}
