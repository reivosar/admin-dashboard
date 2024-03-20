import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

export const UserRepository = {
  async findById(id: number) {
    return this.findUsers({ id: id });
  },

  async findByNameAndEmail(name?: string, email?: string) {
    return this.findUsers({ name: name, email: email });
  },

  async findUsers({
    id,
    name,
    email,
  }: {
    id?: number;
    name?: string;
    email?: string;
  }) {
    let params: any[] = [];
    let whereClause = "";
    if (id) {
      whereClause = `AND "User"."id" = $1`;
      params.push(id);
    } else {
      let whereParts: string[] = [];
      if (name) {
        whereParts.push(`"UserProfile"."name" ILIKE $${params.length + 1}`);
        params.push(`%${name}%`);
      }
      if (email) {
        whereParts.push(`"UserContact"."email" ILIKE $${params.length + 1}`);
        params.push(`%${email}%`);
      }
      whereClause =
        whereParts.length > 0 ? `AND (${whereParts.join(" OR ")})` : "";
    }

    return await prisma.$queryRawUnsafe<unknown[]>(
      `
      SELECT
        "User"."id",
        "UserProfile"."name",
        "UserProfile"."birth_date",
        "UserProfile"."gender",
        "UserContact"."email",
        "UserActive".activated_at,
        (
          SELECT MAX("created_at")
          FROM "UserLog"
          WHERE "User"."id" = "UserLog"."user_id"
        ) AS "lastActivity"
      FROM "User"
      INNER JOIN "UserProfile" ON "User"."id" = "UserProfile"."user_id"
      INNER JOIN "UserContact" ON "User"."id" = "UserContact"."user_id"
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

  async update(user_id: number, { profile, contact }) {
    const updatedUser = await prisma.$transaction(async (prisma) => {
      await prisma.userProfile.deleteMany({
        where: { user_id },
      });
      await prisma.userContact.deleteMany({
        where: { user_id },
      });

      const updatedProfile = await prisma.userProfile.create({
        data: {
          user_id,
          ...profile,
        },
      });
      const updatedContacts = await prisma.userContact.create({
        data: {
          user_id,
          ...contact,
        },
      });

      return { updatedProfile, updatedContacts };
    });

    return updatedUser;
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
