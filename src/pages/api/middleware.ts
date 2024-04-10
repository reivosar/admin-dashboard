import { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromCookie } from "./utils/cookie";
import { verify } from "./utils/jwt";
import { APIError, UnauthorizedError } from "../../errors";
import { AuditLogService } from "@/services/log/audit-log-service";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void | NextApiResponse<any>>;

export function withAuth(handler: ApiHandler): ApiHandler {
  const startTime = new Date();
  return async (req, res) => {
    try {
      const token = getTokenFromCookie(req);
      if (!token) {
        throw new UnauthorizedError("Token is required but was not provided.");
      }
      const verifyResult = verify(token);
      if (verifyResult.error) {
        throw new UnauthorizedError(
          `Token verification failed: ${verifyResult.error}`
        );
      }
      const result = await handler(req, res);
      logRequest(
        req,
        startTime,
        verifyResult.payload?.user_id,
        undefined,
        res.statusCode,
        undefined
      );
      return result;
    } catch (error) {
      if (error instanceof APIError) {
        logRequest(
          req,
          startTime,
          undefined,
          "API Error",
          error.statusCode,
          error.message
        );
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "";
        logRequest(
          req,
          startTime,
          undefined,
          "System Error",
          500,
          errorMessage
        );
        return res.status(500).json({ message: errorMessage });
      }
    }
  };
}

async function logRequest(
  req: NextApiRequest,
  startTime: Date,
  userId?: number,
  description?: string,
  statusCode?: number,
  message?: string
) {
  const { method, url, body, query } = req;
  const urlPath = extractUrlPath(url, req);
  const parameters = safeStringify(body);
  const queryParams = safeStringify(query);
  const ip_address = extractIpAddress(req);
  const finalStatusCode = statusCode ?? 500;
  const endTime = new Date();

  await AuditLogService.createAPILog({
    url: urlPath,
    method: method || "",
    user_id: userId,
    description: description || "API request",
    parameters: parameters,
    query: queryParams,
    ip_address: ip_address,
    response_status: finalStatusCode,
    response_message: message || "",
    request_started_at: startTime,
    request_ended_at: endTime,
  });

  function extractUrlPath(
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

  function safeStringify(obj: any) {
    try {
      return JSON.stringify(obj, (key, value) => {
        if (key === "password") {
          return "";
        }
        return value ? value : "";
      });
    } catch (error) {
      return "";
    }
  }

  function extractIpAddress(req: NextApiRequest): string | undefined {
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
