import { ChannelId } from "@/app/domain/models/message/channeld";
import { ContentDetails } from "@/app/domain/models/message/content/detail";
import { ContentType } from "@/app/domain/models/message/content/type";
import { ServiceContext } from "@/types/shared/service-context";

export interface MessageContentFactory {
  create(
    context: ServiceContext,
    channelId: ChannelId,
    type: ContentType,
    content: ContentDetails
  ): Promise<void>;
}
