import type { NextApiRequest, NextApiResponse } from "next";
import { ServiceContext } from "@/types/shared/service-context";
import { MessageSendService } from "@/services/messages/send";
import { MessageRequest } from "@/types/messages";
import { AuthenticatedApiHandler } from "../../api-handler";

class SendHandler extends AuthenticatedApiHandler {
  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { channelId, type, content } = req.body;
    const data: MessageRequest = {
      channelId: channelId,
      content: {
        type: type,
        content: content,
      },
    };
    return (await MessageSendService.send(context, data)).toResponse(res);
  }
}

export const apiHandler = new SendHandler();
