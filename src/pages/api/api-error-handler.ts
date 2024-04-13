import { APIError } from "@/errors";
import { ServiceContext } from "@/types/shared/service-context";
import { NextApiRequest, NextApiResponse } from "next";
import { logRequest } from "./api-log";

export function handleError(
  req: NextApiRequest,
  res: NextApiResponse,
  startTime: Date,
  userId: number | undefined,
  error: any
) {
  if (error instanceof APIError) {
    logRequest(
      req,
      startTime,
      userId,
      "API Error",
      error.statusCode,
      error.message
    );
    res.status(error.statusCode).json({ message: error.message });
  } else {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    logRequest(req, startTime, userId, "System Error", 500, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
}
