import type { NextApiRequest, NextApiResponse } from "next";
import { DebugRepository } from "@/repositories/DebugRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { name, sort, direction },
    method,
  } = req;

  if (typeof name !== "string" || !name) {
    return res.status(400).end(`table_name is required`);
  }

  switch (method) {
    case "GET":
      return await handleGet(
        name,
        sort as string | undefined,
        direction as string | undefined,
        req,
        res
      );
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(
  name: string,
  sort: string | undefined,
  direction: string | undefined,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const headers = await DebugRepository.findHeaderByName(name);
    const conditions = { ...req.query };
    delete conditions.name;
    delete conditions.sort;
    delete conditions.direction;

    const sortConfig = sort
      ? {
          key: sort,
          direction: direction === "desc" ? "desc" : "asc",
        }
      : undefined;

    const data = await DebugRepository.findBy(name, conditions, sortConfig);
    return res.status(200).json({
      headers,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
