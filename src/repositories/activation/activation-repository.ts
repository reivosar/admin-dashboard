import prisma from "../prisma";
import { ActivationUser } from "@/types/activation";

export const ActivationRepository = {
  async findActivationCodeWithAuthorization(
    activation_code: string
  ): Promise<ActivationUser | null> {
    const activationRecord = await prisma.userActivationCode.findUnique({
      where: {
        activation_code: activation_code,
      },
      include: {
        user: {
          include: {
            user_authorizations: true,
          },
        },
      },
    });

    if (!activationRecord) {
      return null;
    }

    const userAuthorization = activationRecord.user?.user_authorizations;
    if (!userAuthorization) {
      return null;
    }

    return {
      user_id: activationRecord.user_id,
      auth_id: userAuthorization.auth_id,
      password_hash: userAuthorization.password_hash,
      activation_code: activationRecord.activation_code,
      expires_at: activationRecord.expires_at,
    };
  },

  async activate(user_id: number, activation_code: string) {
    const activationUser = await prisma.$transaction(async (prisma) => {
      await prisma.userActivationCode.deleteMany({
        where: { user_id, activation_code },
      });
      const userAuthorization = await prisma.userActive.create({
        data: {
          user_id,
        },
      });
      return { userAuthorization };
    });

    return activationUser;
  },
};
