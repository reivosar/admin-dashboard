import { ChannelQueryService } from "@/app/services/query/message/channel";
import { TYPES } from "@/container/types";
import { ChannelModel } from "@/types/messages/channels";
import { ServiceContext } from "@/types/shared/service-context";
import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";

@injectable()
export class PrismaChannelQueryService implements ChannelQueryService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async getChannels(
    context: ServiceContext,
    searchTerm?: string | undefined
  ): Promise<ChannelModel[]> {
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
  }
}
