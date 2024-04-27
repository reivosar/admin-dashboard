import type { ChannelQueryService } from "@/app/services/query/message/channel";
import { queryServiceOperation } from "@/app/services/service-helper";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import "reflect-metadata";

export interface GetChannelsUseCaseQuery {
  searchTerm: string | undefined;
}

@injectable()
export class GetChannelsUseCase {
  constructor(
    @inject("ChannelQueryService")
    private channelQueryService: ChannelQueryService
  ) {}

  execute(context: ServiceContext, request: GetChannelsUseCaseQuery) {
    return queryServiceOperation(
      this.channelQueryService.getChannels(context, request.searchTerm)
    );
  }
}
