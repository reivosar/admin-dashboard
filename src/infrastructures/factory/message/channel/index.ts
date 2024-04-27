import { ChannelFactory } from "@/app/domain/factories/message/channel";
import { Description } from "@/app/domain/models/shared/description";
import { Name } from "@/app/domain/models/shared/name";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/service-context";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaChannelFactory implements ChannelFactory {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async create(
    context: ServiceContext,
    name: Name,
    description: Description,
    isPublic: boolean
  ): Promise<void> {
    await this.prisma.messageChannel.create({
      data: {
        created_by: context.userId.toString(),
        message_channel_visibility: {
          create: {
            is_public: isPublic,
            created_by: context.userId.toString(),
          },
        },
        message_channel_profiles: {
          create: {
            name: name.asString(),
            description: description.asString(),
            created_by: context.userId.toString(),
          },
        },
      },
    });
  }
}
