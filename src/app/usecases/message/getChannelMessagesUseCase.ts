import type { MessageResponseQueryService } from "@/app/services/query/message/response";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

export interface GetChannelMessagesUseCaseQuery {
  channelId: number;
  lastMessageId?: number;
}

@injectable()
export class GetChannelMessagesUseCase {
  constructor(
    @inject("MessageResponseQueryService")
    private messageResponseQueryService: MessageResponseQueryService
  ) {}

  execute(context: ServiceContext, request: GetChannelMessagesUseCaseQuery) {
    return queryServiceOperation(
      this.messageResponseQueryService.getMessages(
        context,
        request.channelId,
        request.lastMessageId
      )
    );
  }
}
