import { Expire } from "@/app/domain/models/shared/expire";
import { UserToken } from "@/app/domain/models/user/token";
import { TokenHash } from "@/app/domain/models/user/token/tokenHash";
import { UserId } from "@/app/domain/models/user/userId";
import { UserTokenRepository } from "@/app/domain/repositories/user/token";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserTokenRepository implements UserTokenRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: UserId): Promise<boolean> {
    const userToken = await this.prisma.userToken.findFirst({
      where: {
        user_id: id.asNumber(),
      },
    });
    return userToken !== null;
  }

  async findById(id: UserId): Promise<UserToken | null> {
    const userToken = await this.prisma.userToken.findUnique({
      where: {
        user_id: id.asNumber(),
      },
    });
    if (!userToken) return null;
    return new UserToken(
      new UserId(userToken.user_id),
      TokenHash.fromHashString(userToken.token),
      Expire.fromDate(userToken.expires_at)
    );
  }

  async save(context: ServiceContext, entity: UserToken): Promise<void> {
    await this.prisma.userToken.upsert({
      where: {
        user_id: entity.getUserId().asNumber(),
      },
      create: {
        user_id: entity.getUserId().asNumber(),
        token: entity.getTokenHash().asString(),
        expires_at: entity.getExpire().asDate(),
      },
      update: {
        token: entity.getTokenHash().asString(),
        expires_at: entity.getExpire().asDate(),
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.userToken.delete({
      where: {
        user_id: id.asNumber(),
      },
    });
  }
}
