import { MessageResponse } from "@/types/messages";
import { ServiceContext } from "@/types/shared/service-context";

export interface MessageResponseQueryService {
  getMessages(
    context: ServiceContext,
    channelId: number,
    lastMessageId?: number
  ): Promise<MessageResponse[]>;
}
