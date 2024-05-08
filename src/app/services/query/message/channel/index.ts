import { ChannelModel } from "@/types/messages/channels";
import { ServiceContext } from "@/types/shared/serviceContext";

export interface ChannelQueryService {
  getChannels(
    context: ServiceContext,
    searchTerm?: string | undefined
  ): Promise<ChannelModel[]>;
}
