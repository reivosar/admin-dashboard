import { PrismaClient, $Enums } from "@prisma/client";
import prisma from "../prisma";
import {
  UserModelWithDetails,
  UserProfileModel,
  UserAuthorizationModel,
  UserContactModel,
  UserActivationCodeModel,
} from "@/types/users";

export const UserRepository = {
  async findById(id: number): Promise<UserModelWithDetails | null> {
    return (await this.findUsers({ id })).at(0) ?? null;
  },

  async findByNameAndEmail(
    name?: string,
    email?: string
  ): Promise<UserModelWithDetails[]> {
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
  }): Promise<UserModelWithDetails[]> {
    let params: any[] = [];
    let whereClause = "";
    if (id) {
      whereClause = `AND "users"."id" = $1`;
      params.push(id);
    } else {
      let whereParts: string[] = [];
      if (name) {
        whereParts.push(
          `"user_profiles"."first_name" ILIKE $${params.length + 1}`
        );
        whereParts.push(
          `"user_profiles"."last_name" ILIKE $${params.length + 1}`
        );
        params.push(`%${name}%`);
      }
      if (email) {
        whereParts.push(`"user_contacts"."email" ILIKE $${params.length + 1}`);
        params.push(`%${email}%`);
      }
      whereClause =
        whereParts.length > 0 ? `AND (${whereParts.join(" OR ")})` : "";
    }

    return (await prisma.$queryRawUnsafe(
      `
      SELECT
        "users"."id",
        "user_profiles"."first_name",
        "user_profiles"."last_name",
        "user_profiles"."birth_date",
        "user_profiles"."gender",
        "user_contacts"."email",
        "user_authorizations".auth_id,
        "user_authorizations".password_hash,
        "user_actives".activated_at,
        (
          SELECT MAX("created_at")
          FROM "user_logs"
          WHERE "users"."id" = "user_logs"."user_id"
        ) AS "lastActivity"
      FROM "users"
      INNER JOIN "user_profiles" ON "users"."id" = "user_profiles"."user_id"
      INNER JOIN "user_contacts" ON "users"."id" = "user_contacts"."user_id"
      INNER JOIN "user_authorizations" ON "users"."id" = "user_authorizations"."user_id"
      LEFT JOIN "user_actives" ON "users"."id" = "user_actives"."user_id"
      LEFT JOIN "user_deletes" ON "users"."id" = "user_deletes"."user_id"
      WHERE "user_deletes"."user_id" IS NULL
      ${whereClause}
      `,
      ...params
    )) as UserModelWithDetails[];
  },

  async findByEmail(email: string) {
    return await prisma.userContact.findFirst({
      where: {
        email: email,
        user: {
          NOT: {
            user_deletes: {},
          },
        },
      },
    });
  },

  async create(
    profile: UserProfileModel,
    authorization: UserAuthorizationModel,
    contacts: UserContactModel,
    activationCode: UserActivationCodeModel
  ) {
    const user = await prisma.user.create({
      data: {
        user_profiles: {
          create: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            birth_date: profile.birth_date,
            gender: profile.gender as $Enums.GenderType,
          },
        },
        user_authorizations: {
          create: { ...authorization },
        },
        user_contacts: {
          create: { ...contacts },
        },
        user_activation_codes: {
          create: { ...activationCode },
        },
      },
    });
    return user;
  },

  async update(
    user_id: number,
    profile: UserProfileModel,
    authorization: UserAuthorizationModel,
    contact: UserContactModel
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
          first_name: profile.first_name,
          last_name: profile.last_name,
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
          prisma.userAuthorization.deleteMany({
            where: {
              user_id: userId,
            },
          }),
          prisma.userDelete.create({
            data: {
              user_id: userId,
            },
          }),
        ]);
      });
      await Promise.all(transaction);
    } catch (error) {
      throw new Error("Failed to delete users and their authorizations.");
    }
  },
};
