import { PrismaClient, $Enums } from "@prisma/client";

const prisma = new PrismaClient({});

interface UserWithDetails {
  id: number;
  name: string | null;
  birth_date: Date | null;
  gender: string | null;
  email: string | null;
  auth_id: string;
  password_hash: string;
  activated_at: Date | null;
  lastActivity: Date | null;
}

interface UserProfile {
  name: string;
  birth_date: Date | string;
  gender: string;
}

interface UserAuthorization {
  auth_id: string;
  password_hash: string;
}

interface UserContact {
  email: string;
}

export const UserRepository = {
  async findById(id: number): Promise<UserWithDetails | null> {
    return (await this.findUsers({ id })).at(0) ?? null;
  },

  async findByNameAndEmail(
    name?: string,
    email?: string
  ): Promise<UserWithDetails[]> {
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
  }): Promise<UserWithDetails[]> {
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

    return (await prisma.$queryRawUnsafe(
      `
      SELECT
        "User"."id",
        "UserProfile"."name",
        "UserProfile"."birth_date",
        "UserProfile"."gender",
        "UserContact"."email",
        "UserAuthorization".auth_id,
        "UserAuthorization".password_hash,
        "UserActive".activated_at,
        (
          SELECT MAX("created_at")
          FROM "UserLog"
          WHERE "User"."id" = "UserLog"."user_id"
        ) AS "lastActivity"
      FROM "User"
      INNER JOIN "UserProfile" ON "User"."id" = "UserProfile"."user_id"
      INNER JOIN "UserContact" ON "User"."id" = "UserContact"."user_id"
      INNER JOIN "UserAuthorization" ON "User"."id" = "UserAuthorization"."user_id"
      LEFT JOIN "UserActive" ON "User"."id" = "UserActive"."user_id"
      LEFT JOIN "UserDelete" ON "User"."id" = "UserDelete"."user_id"
      WHERE "UserDelete"."user_id" IS NULL
      ${whereClause}
      `,
      ...params
    )) as UserWithDetails[];
  },

  async findByEmail(email: string) {
    return await prisma.userContact.findFirst({
      where: {
        email: email,
        user: {
          NOT: {
            deletion: {},
          },
        },
      },
    });
  },

  async create(
    profile: UserProfile,
    authorization: UserAuthorization,
    contacts: UserContact
  ) {
    const user = await prisma.user.create({
      data: {
        profile: {
          create: {
            name: profile.name,
            birth_date: profile.birth_date,
            gender: profile.gender as $Enums.GenderType,
          },
        },
        authorization: {
          create: { ...authorization },
        },
        contacts: {
          create: { ...contacts },
        },
      },
    });
    return user;
  },

  async update(
    user_id: number,
    profile: UserProfile,
    authorization: UserAuthorization,
    contact: UserContact
  ) {
    const updatedUser = await prisma.$transaction(async (prisma) => {
      await prisma.userProfile.deleteMany({
        where: { user_id },
      });
      await prisma.userAuthorization.deleteMany({
        where: { user_id },
      });
      await prisma.userContact.deleteMany({
        where: { user_id },
      });

      const updatedProfile = await prisma.userProfile.create({
        data: {
          user_id,
          name: profile.name,
          birth_date: profile.birth_date,
          gender: profile.gender as $Enums.GenderType,
        },
      });
      const updatedAuthorization = await prisma.userAuthorization.create({
        data: {
          user_id,
          ...authorization,
        },
      });
      const updatedContacts = await prisma.userContact.create({
        data: {
          user_id,
          ...contact,
        },
      });

      return { updatedProfile, updatedAuthorization, updatedContacts };
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
      throw new Error("Failed to delete users and their authorizations.");
    }
  },
};
