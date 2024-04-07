import { getUseIdFromCookie } from "@/pages/api/utils/cookie";
import { ChannelsRepository } from "@/repositories/messages/channels-repository";
import {
  commandServiceOperation,
  queryServiceOperation,
} from "@/services/service-helper";
import {
  ChannelMemberModel,
  ChannelProfileModel,
  ChannelVisibilityModel,
} from "@/types/messages/channels";

export const ChannelsService = {
  async getUserBySearchTerm(userId: number, searchTerm?: string | undefined) {
    return queryServiceOperation(
      ChannelsRepository.findAll(userId, searchTerm)
    );
  },
  async create(
    channelProfile: ChannelProfileModel,
    channelVisibility: ChannelVisibilityModel,
    channelMembers?: ChannelMemberModel[]
  ) {
    return commandServiceOperation(async () => {
      ChannelsRepository.create(
        channelProfile,
        channelVisibility,
        channelMembers
      );
    });
  },
};
