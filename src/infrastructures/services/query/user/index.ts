import { UserQueryService } from "@/app/services/query/user";
import { TYPES } from "@/container/types";
import { ActivationUser } from "@/types/activation";
import { ServiceContext } from "@/types/shared/serviceContext";
import { UserModelWithDetails, UserNameModel } from "@/types/users";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserQueryService implements UserQueryService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async getUserById(
    context: ServiceContext,
    id: number
  ): Promise<UserModelWithDetails | null> {
    return (await this.findUsers({ id })).at(0) ?? null;
  }

  async getUsersBySearchTerm(
    context: ServiceContext,
    searchTerm: string | undefined
  ): Promise<UserModelWithDetails[]> {
    return this.findUsers({ name: searchTerm, email: searchTerm });
  }

  private async findUsers({
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

    return (await this.prisma.$queryRawUnsafe(
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
          SELECT MAX("audit_logs"."request_started_at")
          FROM "audit_logs"
          WHERE "audit_logs"."user_id" = "users"."id"
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
  }

  async getUserNamesByName(
    context: ServiceContext,
    name: string | undefined
  ): Promise<UserNameModel[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        user_profiles: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      where: {
        user_deletes: null,
      },
      orderBy: {
        user_profiles: {
          first_name: "asc",
        },
      },
    });
    return users.map((user) => ({
      id: user.id,
      name: `${user.user_profiles?.first_name} ${user.user_profiles?.last_name}`,
    }));
  }

  async getActivationUserByActivationCode(
    context: ServiceContext,
    activation_code: string
  ): Promise<ActivationUser | null> {
    const activationRecord = await this.prisma.userActivationCode.findUnique({
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
  }
}
