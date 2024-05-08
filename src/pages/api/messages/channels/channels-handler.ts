import type { NextApiRequest, NextApiResponse } from "next";
import { ChannelsService } from "@/app/services/messages/channels";
import { ServiceContext } from "@/types/shared/serviceContext";
import { AuthenticatedApiHandler } from "../../api-handler";
import { container } from "@/container";
import { CreateChannelUseCase } from "@/app/usecases/message/createChannelUseCase";
import { GetChannelsUseCase } from "@/app/usecases/message/getChannelsUseCase";

class ChannelsHandler extends AuthenticatedApiHandler {
  constructor(
    private getChannesUseCase = container.get(GetChannelsUseCase),
    private createChannelUseCase = container.get(CreateChannelUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const userId = context.userId;
    const searchQuery = req.query["searchTeam"] as string | undefined;
    return (
      await this.getChannesUseCase.execute(context, { searchTerm: searchQuery })
    ).toResponse(res);
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { channelName, description, isPublic, selectedUsers, permissions } =
      req.body;

    return (
      await this.createChannelUseCase.execute(context, {
        name: channelName,
        description: description,
        isPublic: isPublic,
      })
    ).toResponse(res);
  }
}

export const apiHandler = new ChannelsHandler();
