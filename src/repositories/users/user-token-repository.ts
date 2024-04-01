import prisma from "../prisma";

export const UserTokenRepository = {
  async findUserIdBy(token: string): Promise<number | null> {
    const userToken = await prisma.userToken.findFirst({
      where: {
        token,
        expires_at: {
          gt: new Date(),
        },
      },
    });
    if (!userToken) return null;
    return userToken.user_id;
  },

  async create(user_id: number, token: string, expires_at: Date) {
    const user = await prisma.$transaction(async (prisma) => {
      await prisma.userToken.deleteMany({
        where: {
          user_id: user_id,
        },
      });

      const newUserToken = await prisma.userToken.create({
        data: {
          user_id,
          token,
          expires_at,
        },
      });
      return newUserToken;
    });
    return user;
  },
};
