import { AuthenticatedApiHandler } from "../../authenticated-api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { ChannelsService } from "@/services/messages/channels";
import { ServiceContext } from "@/types/shared/service-context";

class ChannelsHandler extends AuthenticatedApiHandler {
  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const userId = context.userId;
    const searchQuery = req.query["searchTeam"] as string | undefined;
    return (
      await ChannelsService.getUserBySearchTerm(userId, searchQuery)
    ).toResponse(res);
  }

  protected async handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { channelName, description, isPublic, selectedUsers, permissions } =
      req.body;

    const channelProfile = {
      name: channelName,
      description: description,
    };
    const channelVisibility = {
      isPublic: isPublic,
    };
    return (
      await ChannelsService.create(channelProfile, channelVisibility)
    ).toResponse(res);
  }
}

export const apiHandler = new ChannelsHandler();
