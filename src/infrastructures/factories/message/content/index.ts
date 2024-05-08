import { MessageContentFactory } from "@/app/domain/factories/message/content";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { ContentDetails } from "@/app/domain/models/message/content/detail";
import { ContentType } from "@/app/domain/models/message/content/type";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { $Enums, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaMessageContentFactory implements MessageContentFactory {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async create(
    context: ServiceContext,
    channelId: ChannelId,
    type: ContentType,
    content: ContentDetails
  ): Promise<void> {
    await this.prisma.message.create({
      data: {
        channel_id: channelId.asNumber(),
        sended_by: context.userId,
        message_contents: {
          create: {
            contentType: type.asString() as $Enums.ContentType,
            content: content.asJson(),
          },
        },
      },
      include: {
        message_contents: true,
      },
    });
  }
}
