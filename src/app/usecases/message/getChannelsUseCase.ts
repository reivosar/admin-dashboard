import type { ChannelQueryService } from "@/app/services/query/message/channel";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { queryUseCaseOperation } from "../usecaseHelper";

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
    return queryUseCaseOperation(
      this.channelQueryService.getChannels(context, request.searchTerm)
    );
  }
}
