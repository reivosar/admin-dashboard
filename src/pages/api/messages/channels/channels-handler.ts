import { APIHandler } from "../../api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromCookie, getUseIdFromCookie } from "../../utils/cookie";
import { ChannelsService } from "@/services/messages/channels";

class ChannelsHandler extends APIHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUseIdFromCookie(req);
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
