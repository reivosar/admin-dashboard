import type { MessageContentFactory } from "@/app/domain/factories/message/content";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { ContentType } from "@/app/domain/models/message/content/type";
import { ContentDetails } from "@/app/domain/models/message/content/detail";
import "reflect-metadata";

export interface SendMessageUseCaseCommand {
  channelId: number;
  contentType: string;
  contentDetails: any;
}

@injectable()
export class SendMessageUseCase {
  constructor(
    @inject("MessageContentFactory")
    private messageContentFactory: MessageContentFactory
  ) {}

  execute(context: ServiceContext, request: SendMessageUseCaseCommand) {
    return commandUseCaseOperation(async () => {
      this.messageContentFactory.create(
        context,
        new ChannelId(request.channelId),
        new ContentType(request.contentType),
        new ContentDetails(request.contentDetails)
      );
    });
  }
}
