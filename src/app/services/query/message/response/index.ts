import { MessageResponse } from "@/types/messages";
import { ServiceContext } from "@/types/shared/serviceContext";

export interface MessageResponseQueryService {
  getMessages(
    context: ServiceContext,
    channelId: number,
    lastMessageId?: number
  ): Promise<MessageResponse[]>;
}
