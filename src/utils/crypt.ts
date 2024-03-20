import { hash } from "bcrypt";

const saltRounds: number = 10;

export const generateHash = async (value: string): Promise<string> => {
  return await hash(value, saltRounds);
};
