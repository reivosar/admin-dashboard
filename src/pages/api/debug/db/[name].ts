import type { NextApiRequest, NextApiResponse } from "next";
import { DebugRepository } from "@/repositories/DebugRepository";

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
  try {
    let { sort, direction } = req.query;
    let conditions = {};

    const headers = await DebugRepository.findHeaderByName(name);

    if (typeof req.query.filter === "string") {
      try {
        const rawConditions = JSON.parse(req.query.filter);
        conditions = convertFilterConditions(rawConditions, headers);
      } catch (err) {
        return res.status(400).json({ error: "Invalid filter format" });
      }
    }

    const sortConfig =
      typeof sort === "string" && typeof direction === "string"
        ? { key: sort, direction: direction }
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

interface TableColumn {
  column_name: string;
  data_type: string;
}

function convertFilterConditions(
  conditions: Record<string, any>,
  headers: TableColumn[]
) {
  const convertedConditions: Record<string, any> = {};

  Object.entries(conditions).forEach(([columnName, filterValue]) => {
    const trimmedFilterValue = typeof filterValue
      ? filterValue.trim()
      : filterValue;
    if (!trimmedFilterValue) return;

    const columnInfo = headers.find(
      (header) => header.column_name === columnName
    );
    if (!columnInfo) return;

    switch (columnInfo.data_type) {
      case "integer":
        convertedConditions[columnName] = parseInt(trimmedFilterValue, 10);
        if (isNaN(convertedConditions[columnName])) {
          throw new Error(`Invalid integer format for column ${columnName}`);
        }
        break;
      default:
        convertedConditions[columnName] = trimmedFilterValue;
    }
  });

  return convertedConditions;
}
