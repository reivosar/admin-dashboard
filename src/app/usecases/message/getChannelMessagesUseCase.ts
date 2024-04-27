import type { MessageResponseQueryService } from "@/app/services/query/message/response";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

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
    return queryUseCaseOperation(
      this.messageResponseQueryService.getMessages(
        context,
        request.channelId,
        request.lastMessageId
      )
    );
  }
}
