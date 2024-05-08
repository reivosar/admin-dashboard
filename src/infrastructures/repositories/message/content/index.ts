import { ChannelMemberId } from "@/app/domain/models/message/channelMemberId";
import { ContentType } from "@/app/domain/models/message/content/type";
import { MessageContent } from "@/app/domain/models/message/content";
import { MessageId } from "@/app/domain/models/message/messageld";
import { MessageContentRepository } from "@/app/domain/repositories/message/content";
import { ServiceContext } from "@/types/shared/serviceContext";
import { $Enums, PrismaClient } from "@prisma/client";
import { ContentDetails } from "@/app/domain/models/message/content/detail";
import { MemberId } from "@/app/domain/models/message/memberId";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "@/container/types";

@injectable()
export class PrismaMessageContentRepository
  implements MessageContentRepository
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: MessageId): Promise<boolean> {
    const messageContent = await this.prisma.messageContent.findFirst({
      where: {
        message_id: id.asNumber(),
      },
    });
    return messageContent !== null;
  }

  async findById(id: MessageId): Promise<MessageContent | null> {
    const messageContent = await this.prisma.messageContent.findUnique({
      where: {
        message_id: id.asNumber(),
      },
      include: {
        message: true,
      },
    });
    if (!messageContent) return null;
    return new MessageContent(
      new MessageId(messageContent.message_id),
      new ContentType(messageContent.contentType),
      new ContentDetails(messageContent.content as string),
      new MemberId(messageContent.message.sended_by)
    );
  }

  async save(context: ServiceContext, entity: MessageContent): Promise<void> {
    await this.prisma.messageContent.upsert({
      where: {
        message_id: entity.getMessageId().asNumber(),
      },
      create: {
        message_id: entity.getMessageId().asNumber(),
        contentType: entity.getContentType().asString() as $Enums.ContentType,
        content: JSON.stringify(entity.asJson()),
      },
      update: {
        contentType: entity.getContentType().asString() as $Enums.ContentType,
        content: JSON.stringify(entity.asJson()),
      },
    });
  }

  async delete(id: MessageId): Promise<void> {
    await this.prisma.messageContent.delete({
      where: {
        message_id: id.asNumber(),
      },
    });
  }
}
