import { APIError } from "@/utils/errors";
import { NextApiResponse } from "next";

export class ApiResult<T> {
  success: boolean;
  private statusCode: number;
  private message?: string;
  data?: T;
  error?: any;

  constructor(data?: T, error?: any, message?: string) {
    this.success = !error;
    this.data = data;
    this.error = error;
    this.statusCode = this.determineStatusCode(200, error);
    this.message = this.determineMessage(message, error);
  }

  private determineStatusCode(
    defaultStatusCode: number,
    error?: Error
  ): number {
    if (error) {
      if (error instanceof APIError) {
        return error.statusCode;
      }
      return 500;
    }
    return defaultStatusCode;
  }

  private determineMessage(message?: string, error?: Error): string {
    if (error) {
      if (error instanceof APIError) {
        if (error.message) {
          return error.message;
        }
      }
      return message ? message : "An unexpected error occurred";
    }
    return message ? message : "Success";
  }

  public toResponse(res: NextApiResponse) {
    if (this.success) {
      if (!this.data) {
        return res.status(this.statusCode).json({ message: this.message });
      }
      return res.status(this.statusCode).json(this.data);
    }
    return res.status(this.statusCode).json({ message: this.message });
  }
}
