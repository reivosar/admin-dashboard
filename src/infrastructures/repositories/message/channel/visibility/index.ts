import { ChannelVisibility } from "@/app/domain/models/message/channel/visibility";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { ChannelVisibilityRepository } from "@/app/domain/repositories/message/channel/visibility";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/service-context";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaChannelVisibilityRepository
  implements ChannelVisibilityRepository
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: ChannelId): Promise<boolean> {
    const channelVisibility =
      await this.prisma.messageChannelVisibility.findFirst({
        where: {
          channel_id: id.asNumber(),
        },
      });
    return channelVisibility !== null;
  }

  async findById(id: ChannelId): Promise<ChannelVisibility | null> {
    const channelVisibility =
      await this.prisma.messageChannelVisibility.findUnique({
        where: {
          channel_id: id.asNumber(),
        },
      });
    if (!channelVisibility) return null;
    return new ChannelVisibility(
      new ChannelId(channelVisibility.channel_id),
      channelVisibility.is_public
    );
  }

  async save(
    context: ServiceContext,
    entity: ChannelVisibility
  ): Promise<void> {
    await this.prisma.messageChannelVisibility.upsert({
      where: {
        channel_id: entity.getChannelId().asNumber(),
      },
      create: {
        channel_id: entity.getChannelId().asNumber(),
        is_public: entity.isPublicChannel(),
      },
      update: {
        is_public: entity.isPublicChannel(),
      },
    });
  }

  async delete(id: ChannelId): Promise<void> {
    await this.prisma.messageChannelVisibility.delete({
      where: {
        channel_id: id.asNumber(),
      },
    });
  }
}
