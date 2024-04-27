import { APIError } from "@/utils/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { inject, injectable } from "inversify";
import { LogRegister } from "./log-register";
import "reflect-metadata";

@injectable()
export class ErrorHandler {
  constructor(
    @inject(LogRegister)
    private logRegister: LogRegister
  ) {}

  handleError(
    req: NextApiRequest,
    res: NextApiResponse,
    startTime: Date,
    userId: number | undefined,
    error: any
  ) {
    if (error instanceof APIError) {
      this.logRegister.execute(
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
      this.logRegister.execute(
        req,
        startTime,
        userId,
        "System Error",
        500,
        errorMessage
      );
      res.status(500).json({ message: errorMessage });
    }
  }
}
