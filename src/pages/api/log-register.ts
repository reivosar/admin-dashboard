import type { LogService } from "@/app/services/log";
import { injectable, inject } from "inversify";
import { NextApiRequest } from "next";
import "reflect-metadata";

@injectable()
export class LogRegister {
  constructor(
    @inject("LogService")
    private logService: LogService
  ) {}

  async execute(
    req: NextApiRequest,
    startTime: Date,
    userId?: number,
    description?: string,
    statusCode?: number,
    message?: string
  ) {
    const { method, url, body, query } = req;
    const urlPath = this.extractUrlPath(url, req);
    const parameters = this.safeStringify(body);
    const queryParams = this.safeStringify(query);
    const ip_address = this.extractIpAddress(req);
    const finalStatusCode = statusCode ?? 500;
    const endTime = new Date();

    await this.logService.registerAuditLog(
      urlPath,
      method || "",
      finalStatusCode,
      startTime,
      endTime,
      userId,
      description || "API request",
      parameters,
      queryParams,
      ip_address,
      message || ""
    );
  }

  private extractUrlPath(
    fullUrl: string | undefined,
    req: NextApiRequest
  ): string {
    if (!fullUrl) return "";
    const protocol =
      req.headers["x-forwarded-proto"] === "https" ? "https://" : "http://";
    try {
      const url = new URL(fullUrl, `${protocol}${req.headers.host}`);
      return url.pathname;
    } catch (error) {
      console.error("Error extracting URL path:", error);
      return "";
    }
  }

  private safeStringify(obj: any) {
    try {
      return JSON.stringify(obj, (key, value) => {
        if (key === "password") {
          return "";
        }
        if (key === "confirmPassword") {
          return "";
        }
        if (key === "autoGeneratePassword") {
          return "";
        }
        return value ? value : "";
      });
    } catch (error) {
      return "";
    }
  }

  private extractIpAddress(req: NextApiRequest): string | undefined {
    const xForwardedFor = req.headers["x-forwarded-for"];
    if (typeof xForwardedFor === "string") {
      return xForwardedFor.split(",")[0].trim();
    } else if (Array.isArray(xForwardedFor)) {
      return xForwardedFor[0].trim();
    } else if (req.socket && req.socket.remoteAddress) {
      return req.socket.remoteAddress;
    }
    return undefined;
  }
}
