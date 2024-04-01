import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const secretKey: string =
  process.env.JWT_SECRET_KEY || "your_default_secret_key";

interface VerifyResult {
  valid: boolean;
  payload?: CustomJwtPayload;
  error?: string;
}

interface CustomJwtPayload extends JwtPayload {
  user_id: string;
  loginDate: string;
}

export const sign = (
  payload: object,
  expiresIn: string | number = "24h"
): string => {
  const signOptions: SignOptions = { expiresIn };
  return jwt.sign(payload, secretKey, signOptions);
};

export const verify = (token: string): VerifyResult => {
  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
    return { valid: true, payload: decoded };
  } catch (error) {
    console.error(error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
