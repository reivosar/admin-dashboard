import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

export const UserRepository = {
  async findByNameAndEmail(name?: string, email?: string) {
    let whereParts: string[] = [];
    let params: any[] = [];

    if (name) {
      whereParts.push(`"UserProfile"."name" ILIKE $1 `);
      params.push(`%${name}%`);
    }
    if (email) {
      whereParts.push(`"UserContact"."email" ILIKE $2 `);
      params.push(`%${email}%`);
    }

    let whereClause =
      whereParts.length > 0 ? `AND ${whereParts.join(" OR ")}` : "";

    return await prisma.$queryRawUnsafe<unknown[]>(
      `
      SELECT
        "User"."id",
        "UserProfile"."name",
        "UserContact"."email",
        "UserActive".activated_at,
        (
          SELECT MAX("created_at")
          FROM "UserLog"
          WHERE "User"."id" = "UserLog"."user_id"
        ) AS "lastActivity"
      FROM "User"
      LEFT JOIN "UserProfile" ON "User"."id" = "UserProfile"."user_id"
      LEFT JOIN "UserContact" ON "User"."id" = "UserContact"."user_id"
      LEFT JOIN "UserActive" ON "User"."id" = "UserActive"."user_id"
      LEFT JOIN "UserDelete" ON "User"."id" = "UserDelete"."user_id"
      WHERE "UserDelete"."user_id" IS NULL
      ${whereClause}
    `,
      ...params
    );
  },

  async save({ profile, authorization, contacts, ...userData }) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: profile,
        },
        authorization: {
          create: authorization,
        },
        contacts: {
          create: contacts,
        },
      },
    });
    return user;
  },

  async delete(userIds: number[]) {
    try {
      const transaction = userIds.map((userId) => {
        return prisma.$transaction([
          prisma.userDelete.create({
            data: {
              user_id: userId,
            },
          }),
          prisma.userAuthorization.deleteMany({
            where: {
              user_id: userId,
            },
          }),
        ]);
      });
      await Promise.all(transaction);

      return {
        message: "Users successfully deleted and their authorizations removed.",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete users and their authorizations.");
    }
  },
};
