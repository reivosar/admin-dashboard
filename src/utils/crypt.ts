import { hash } from "bcrypt";
import { randomBytes } from "crypto";

const saltRounds: number = 10;

export const generateHash = async (value: string): Promise<string> => {
  return await hash(value, saltRounds);
};

export const generateRandomString = () => {
  return randomBytes(16).toString("hex");
};
