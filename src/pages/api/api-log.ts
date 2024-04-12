import { AuditLogService } from "@/services/log/audit-log-service";
import { NextApiRequest } from "next";

export async function logRequest(
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
