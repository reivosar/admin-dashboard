import { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromCookie } from "./utils/cookie";
import { verify } from "./utils/jwt";
import { APIError, UnauthorizedError } from "../../errors";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void | NextApiResponse<any>>;

export function withAuth(handler: ApiHandler): ApiHandler {
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
      return await handler(req, res);
    } catch (error) {
      if (error instanceof APIError) {
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
}
