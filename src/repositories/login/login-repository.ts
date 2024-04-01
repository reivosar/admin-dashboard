import prisma from "../prisma";
import { LoginModel } from "@/types/login";

export const LoginRepository = {
  async findyByEmail(email: string): Promise<LoginModel | undefined> {
    const result = await prisma.userAuthorization.findUnique({
      where: {
        auth_id: email,
      },
    });

    if (!result) {
      return undefined;
    }

    return { user_id: result.user_id, passsword_hash: result.password_hash };
  },
};
