import type { NextApiRequest, NextApiResponse } from "next";
import { TableRepository } from "@/repositories/debug/TableRepository";

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

interface TableColumn {
  column_name: string;
  data_type: string;
}

async function handleGet(
  name: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sort, direction } = req.query;
    let conditions: Record<string, any> = [];

    const headers = await TableRepository.findHeaderByName(name);

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

    conditions = convertFilterConditions(conditions, headers);

    const sortConfig =
      typeof sort === "string" && typeof direction === "string"
        ? { key: sort, direction: direction }
        : undefined;

    const data = await TableRepository.findBy(name, conditions, sortConfig);

    return res.status(200).json({
      headers,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function convertFilterConditions(
  conditions: Record<string, any>,
  headers: TableColumn[]
) {
  const convertedConditions: Record<string, any> = {};

  Object.entries(conditions).forEach(([columnName, rawValue]) => {
    const columnInfo = headers.find(
      (header) => header.column_name === columnName
    );
    if (!columnInfo) return;

    if (!rawValue) return;

    let value = rawValue;
    if (typeof rawValue === "string") {
      value = rawValue.trim();
      if (value === "") return;
    }

    switch (columnInfo.data_type) {
      case "integer":
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new Error(`Invalid integer format for column '${columnName}'.`);
        }
      case "timestamp without time zone":
        break;
      case "text":
        break;
      default:
        break;
    }

    convertedConditions[columnName] = value;
  });

  return convertedConditions;
}
