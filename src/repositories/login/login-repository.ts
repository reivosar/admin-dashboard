import prisma from "../prisma";

export const LoginRepository = {
  async findyByEmail(email: string): Promise<string | undefined> {
    const result = await prisma.userAuthorization.findUnique({
      where: {
        auth_id: email,
      },
    });
    return result?.password_hash;
  },
};
