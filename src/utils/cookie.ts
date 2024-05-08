import { NextApiRequest } from "next";
import { parse, serialize } from "cookie";
import { verify } from "./jwt";
import { ForbiddenError, UnauthorizedError } from "@/utils/errors";

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

export const getUserIdFromCookie = (req: NextApiRequest): number => {
  const token = getTokenFromCookie(req);
  const verifyResult = verify(token);
  if (!verifyResult.payload?.user_id) {
    throw new ForbiddenError(
      "Token verification failed: No payload found in token."
    );
  }
  return verifyResult.payload?.user_id;
};

export const createSerializeAuthToken = (token: string): string => {
  const serializedToken = serialize("authToken", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
    path: "/",
  });
  return serializedToken;
};

export const clearAuthToken = (): string => {
  const serializedToken = serialize("authToken", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });
  return serializedToken;
};
