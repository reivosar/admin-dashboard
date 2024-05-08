import { UserActivation } from "@/app/domain/models/user/activation";
import { UserId } from "@/app/domain/models/user/userId";
import { UserActivationRepository } from "@/app/domain/repositories/user/activation";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserActivationRepository
  implements UserActivationRepository
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: UserId): Promise<boolean> {
    const userActivation = await this.prisma.userActive.findFirst({
      where: {
        user_id: id.asNumber(),
      },
    });
    return userActivation !== null;
  }

  async findById(id: UserId): Promise<UserActivation | null> {
    const userActivation = await this.prisma.userActive.findUnique({
      where: {
        user_id: id.asNumber(),
      },
    });
    if (!userActivation) return null;
    return new UserActivation(new UserId(userActivation.user_id));
  }

  async save(context: ServiceContext, entity: UserActivation): Promise<void> {
    await this.prisma.userActive.upsert({
      where: {
        user_id: entity.getUserId().asNumber(),
      },
      create: {
        user_id: entity.getUserId().asNumber(),
        activated_at: new Date(),
      },
      update: {
        activated_at: new Date(),
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.userActive.delete({
      where: {
        user_id: id.asNumber(),
      },
    });
  }
}
