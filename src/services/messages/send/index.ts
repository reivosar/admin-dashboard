import { MessageSendRepository } from "@/repositories/message/message-send-repository";
import { commandServiceOperation } from "@/services/service-helper";
import { MessageRequest } from "@/types/messages";
import { ServiceContext } from "@/types/shared/service-context";

export const MessageSendService = {
  async send(context: ServiceContext, data: MessageRequest) {
    return commandServiceOperation(async () => {
      MessageSendRepository.create(context, data);
    });
  },
};
