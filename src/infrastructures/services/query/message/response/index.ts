import { MessageResponseQueryService } from "@/app/services/query/message/response";
import { TYPES } from "@/container/types";
import { MessageResponse } from "@/types/messages";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient, Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaMessageResponseQueryService
  implements MessageResponseQueryService
{
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}
  async getMessages(
    context: ServiceContext,
    channelId: number,
    lastMessageId?: number | undefined
  ): Promise<MessageResponse[]> {
    const whereCondition: Prisma.MessageWhereInput = {
      channel_id: channelId,
      ...(lastMessageId !== undefined && { id: { gt: lastMessageId } }),
    };

    const messages = await this.prisma.message.findMany({
      where: whereCondition,
      include: {
        message_contents: true,
        users: {
          include: {
            user_profiles: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return messages.map((message) => ({
      channelId: channelId,
      id: message.id,
      content: message.message_contents?.content,
      contentType: message.message_contents?.contentType || "text",
      isOwnMessage: message.sended_by === context.userId,
      sendedBy: {
        id: message.sended_by,
        name: [
          message.users?.user_profiles?.first_name,
          message.users?.user_profiles?.last_name,
        ]
          .filter(Boolean)
          .join(" "),
      },
      sendedAt: message.sended_at,
    }));
  }
}
