import {
  ChannelMemberModel,
  ChannelModel,
  ChannelProfileModel,
  ChannelVisibilityModel,
} from "@/types/messages/channels";
import prisma from "../prisma";

export const ChannelsRepository = {
  async findAll(user_id: number, name?: string): Promise<ChannelModel[]> {
    const results = await prisma.messageChannel.findMany({
      include: {
        message_channel_profiles: true,
        message_channel_visibility: true,
      },
      orderBy: {
        message_channel_profiles: {
          name: "asc",
        },
      },
    });
    return results.map((channel) => ({
      id: channel.id,
      name: channel.message_channel_profiles?.name ?? "",
      description: channel.message_channel_profiles?.description ?? "",
      isPublic: channel.message_channel_visibility?.is_public ?? false,
      created_at: channel.created_at,
    }));
  },
  async create(
    channelProfile: ChannelProfileModel,
    channelVisibility: ChannelVisibilityModel,
    channelMembers?: ChannelMemberModel[]
  ) {
    const channel = await prisma.messageChannel.create({
      data: {
        message_channel_visibility: {
          create: {
            is_public: channelVisibility.isPublic,
          },
        },
        message_channel_profiles: {
          create: { ...channelProfile },
        },
      },
    });
    return channel;
  },
};
