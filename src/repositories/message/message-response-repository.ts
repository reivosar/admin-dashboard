import { MessageResponse } from "@/types/messages";
import prisma from "../prisma";
import { ServiceContext } from "@/types/shared/service-context";
import { Prisma } from "@prisma/client";

export const MessageResponseRepository = {
  async findAll(
    context: ServiceContext,
    channelId: number,
    lastMessageId?: number
  ): Promise<MessageResponse[]> {
    const whereCondition: Prisma.MessageWhereInput = {
      channel_id: channelId,
      ...(lastMessageId !== undefined && { id: { gt: lastMessageId } }),
    };

    const messages = await prisma.message.findMany({
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
  },
};
