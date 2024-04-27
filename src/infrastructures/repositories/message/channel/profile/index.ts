import { ChannelProfile } from "@/app/domain/models/message/channel/profile";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { Description } from "@/app/domain/models/shared/description";
import { Name } from "@/app/domain/models/shared/name";
import { ChannelProfileRepository } from "@/app/domain/repositories/message/channel/profile";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/service-context";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaChannelProfileRepository
  implements ChannelProfileRepository
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: ChannelId): Promise<boolean> {
    const channelProfile = await this.prisma.messageChannelProfile.findFirst({
      where: {
        channel_id: id.asNumber(),
      },
    });
    return channelProfile !== null;
  }

  async findById(id: ChannelId): Promise<ChannelProfile | null> {
    const channelProfile = await this.prisma.messageChannelProfile.findUnique({
      where: {
        channel_id: id.asNumber(),
      },
    });
    if (!channelProfile) return null;
    return new ChannelProfile(
      new ChannelId(channelProfile.channel_id),
      new Name(channelProfile.name),
      new Description(channelProfile.description)
    );
  }

  async save(context: ServiceContext, entity: ChannelProfile): Promise<void> {
    await this.prisma.messageChannelProfile.upsert({
      where: {
        channel_id: entity.getChannelId().asNumber(),
      },
      create: {
        channel_id: entity.getChannelId().asNumber(),
        name: entity.getName().asString(),
        description: entity.getDescription().asString(),
        created_by: context.userId.toString(),
      },
      update: {
        name: entity.getName().asString(),
        description: entity.getDescription().asString(),
      },
    });
  }

  async delete(id: ChannelId): Promise<void> {
    await this.prisma.messageChannelProfile.delete({
      where: {
        channel_id: id.asNumber(),
      },
    });
  }
}
