import type { NextApiRequest, NextApiResponse } from "next";
import { TablenService } from "@/services/debug/table-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { name },
    method,
  } = req;

  if (typeof name !== "string" || !name) {
    return res.status(400).end(`table_name is required`);
  }

  switch (method) {
    case "GET":
      return await handleGet(name, req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(
  name: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conditions: Record<string, any> = [];

  Object.keys(req.query).forEach((key) => {
    if (key.startsWith("filter[")) {
      const match = key.match(/^filter\[(.*?)\]$/);
      const filterKey = match && match[1];
      if (filterKey) {
        const value = req.query[key];
        conditions[filterKey] = value;
      }
    }
  });

  const sort = Array.isArray(req.query.sort)
    ? req.query.sort[0]
    : req.query.sort;
  const direction = Array.isArray(req.query.direction)
    ? req.query.direction[0]
    : req.query.direction;

  return (
    await TablenService.getTableInfo(name, conditions, sort, direction)
  ).toResponse(res);
}
