import { MessageResponseRepository } from "@/repositories/message/message-response-repository";
import { queryServiceOperation } from "@/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";

export const MessageResponseService = {
  async getMessages(
    context: ServiceContext,
    channelId: number,
    lastMessageId?: number
  ) {
    return queryServiceOperation(
      MessageResponseRepository.findAll(context, channelId, lastMessageId)
    );
  },
};
