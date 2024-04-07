import { NextApiRequest } from "next";
import { parse } from "cookie";
import { verify } from "./jwt";
import { ForbiddenError, UnauthorizedError } from "@/errors";

export const getTokenFromCookie = (req: NextApiRequest) => {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies?.authToken;
  if (!token) {
    throw new UnauthorizedError("Token is required but was not provided.");
  }
  const verifyResult = verify(token);
  if (verifyResult.error) {
    throw new ForbiddenError(
      `Token verification failed: ${verifyResult.error}`
    );
  }
  if (!verifyResult.payload) {
    throw new ForbiddenError(
      "Token verification failed: No payload found in token."
    );
  }

  return token;
};

export const getUseIdFromCookie = (req: NextApiRequest): number => {
  const token = getTokenFromCookie(req);
  const verifyResult = verify(token);
  if (!verifyResult.payload?.user_id) {
    throw new ForbiddenError(
      "Token verification failed: No payload found in token."
    );
  }
  return verifyResult.payload?.user_id;
};
