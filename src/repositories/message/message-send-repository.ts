import { ServiceContext } from "@/types/shared/service-context";
import prisma from "../prisma";
import { MessageRequest } from "@/types/messages";

export const MessageSendRepository = {
  async create(context: ServiceContext, data: MessageRequest) {
    const message = await prisma.message.create({
      data: {
        channel_id: data.channelId,
        sended_by: context.userId,
        message_contents: data.content
          ? {
              create: {
                contentType: data.content.type,
                content: data.content.content,
              },
            }
          : undefined,
      },
      include: {
        message_contents: true,
      },
    });
    return message;
  },
};
