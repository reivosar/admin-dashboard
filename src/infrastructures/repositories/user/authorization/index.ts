import { UserAuthorization } from "@/app/domain/models/user/authorization";
import { AuthId } from "@/app/domain/models/user/authorization/authid";
import { PasswordHash } from "@/app/domain/models/user/authorization/passwordHash";
import { UserId } from "@/app/domain/models/user/userId";
import { UserAuthorizationRepository } from "@/app/domain/repositories/user/authorization";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserAuthorizationRepository
  implements UserAuthorizationRepository
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findByAuthId(authId: AuthId): Promise<UserAuthorization | null> {
    const userAuthorization = await this.prisma.userAuthorization.findUnique({
      where: {
        auth_id: authId.asString(),
      },
    });
    if (!userAuthorization) return null;
    return new UserAuthorization(
      new UserId(userAuthorization.user_id),
      new AuthId(userAuthorization.auth_id),
      PasswordHash.fromHashString(userAuthorization.password_hash),
      userAuthorization.is_initial_password
    );
  }

  async existsById(id: UserId): Promise<boolean> {
    const userAuthorization = await this.prisma.userAuthorization.findFirst({
      where: {
        user_id: id.asNumber(),
      },
    });
    return userAuthorization !== null;
  }

  async findById(id: UserId): Promise<UserAuthorization | null> {
    const userAuthorization = await this.prisma.userAuthorization.findUnique({
      where: {
        user_id: id.asNumber(),
      },
    });
    if (!userAuthorization) return null;
    return new UserAuthorization(
      new UserId(userAuthorization.user_id),
      new AuthId(userAuthorization.auth_id),
      PasswordHash.fromHashString(userAuthorization.password_hash),
      userAuthorization.is_initial_password
    );
  }

  async save(
    context: ServiceContext,
    entity: UserAuthorization
  ): Promise<void> {
    await this.prisma.userAuthorization.upsert({
      where: {
        user_id: entity.getUserId().asNumber(),
      },
      create: {
        user_id: entity.getUserId().asNumber(),
        auth_id: entity.getAuthId().asString(),
        password_hash: entity.getPasswordHash().asString(),
        is_initial_password: entity.isInitialPassword(),
        created_by: context.userId.toString(),
      },
      update: {
        auth_id: entity.getAuthId().asString(),
        password_hash: entity.getPasswordHash().asString(),
        is_initial_password: entity.isInitialPassword(),
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.userAuthorization.delete({
      where: {
        user_id: id.asNumber(),
      },
    });
  }
}
