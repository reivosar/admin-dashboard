import { Expire } from "@/app/domain/models/shared/expire";
import { UserActivationCode } from "@/app/domain/models/user/activationCode";
import { ActivationCode } from "@/app/domain/models/user/activationCode/activationCode";
import { UserId } from "@/app/domain/models/user/userId";
import { UserActivationCodeRepository } from "@/app/domain/repositories/user/activationCode";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/service-context";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserActivationCodeRepository
  implements UserActivationCodeRepository
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findByActivationCode(
    activationCode: ActivationCode
  ): Promise<UserActivationCode | null> {
    const userActivationCode = await this.prisma.userActivationCode.findUnique({
      where: {
        activation_code: activationCode.asString(),
      },
    });
    if (!userActivationCode) return null;
    return new UserActivationCode(
      new UserId(userActivationCode.user_id),
      new ActivationCode(userActivationCode.activation_code),
      Expire.fromDate(userActivationCode.expires_at)
    );
  }

  async existsById(id: UserId): Promise<boolean> {
    const userActivationCode = await this.prisma.userActivationCode.findFirst({
      where: {
        user_id: id.asNumber(),
      },
    });
    return userActivationCode !== null;
  }

  async findById(id: UserId): Promise<UserActivationCode | null> {
    const userActivationCode = await this.prisma.userActivationCode.findUnique({
      where: {
        user_id: id.asNumber(),
      },
    });
    if (!userActivationCode) return null;
    return new UserActivationCode(
      new UserId(userActivationCode.user_id),
      new ActivationCode(userActivationCode.activation_code),
      Expire.fromDate(userActivationCode.expires_at)
    );
  }

  async save(
    context: ServiceContext,
    entity: UserActivationCode
  ): Promise<void> {
    await this.prisma.userActivationCode.upsert({
      where: {
        user_id: entity.getUserId().asNumber(),
      },
      create: {
        user_id: entity.getUserId().asNumber(),
        activation_code: entity.getActivationCode().asString(),
        expires_at: entity.getExpiration().asDate(),
      },
      update: {
        activation_code: entity.getActivationCode().asString(),
        expires_at: entity.getExpiration().asDate(),
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.userActivationCode.delete({
      where: {
        user_id: id.asNumber(),
      },
    });
  }
}
