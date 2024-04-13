import { ServiceContext } from "@/types/shared/service-context";
import { NextApiRequest, NextApiResponse } from "next";
import { MessageResponseService } from "@/services/messages/response";
import { MessageResponse } from "@/types/messages";
import { sseManager } from "../../utils/sme";
import { AuthenticatedApiHandler } from "../../api-handler";

class ResponseHandler extends AuthenticatedApiHandler {
  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const channelId = parseInt(req.query.channelId as string);
    const lastMessageId = req.query.lastMessageId
      ? parseInt(req.query.lastMessageId as string)
      : undefined;

    if (isNaN(channelId)) {
      return res
        .status(400)
        .json({ error: "Channel ID must be a valid number." });
    }

    if (lastMessageId && isNaN(lastMessageId)) {
      return res
        .status(400)
        .json({ error: "Invalid last message ID provided." });
    }

    let searchLastMessageId = lastMessageId;
    const onData = async () => {
      try {
        const newMessages = await MessageResponseService.getMessages(
          context,
          channelId,
          searchLastMessageId
        );
        if (!newMessages || !newMessages.data || newMessages.data.length == 0) {
          return [];
        }

        const eventData = newMessages.data.map((message: MessageResponse) => ({
          id: message.id,
          sendedAt: message.sendedAt,
          content: message.content,
          contentType: message.contentType,
          isOwnMessage: message.isOwnMessage,
          sendedBy: {
            id: message.sendedBy?.id,
            name: message.sendedBy?.name,
          },
        }));

        if (eventData.length > 0) {
          searchLastMessageId = eventData[eventData.length - 1].id;
        }
        return eventData;
      } catch (error) {
        console.error("Error fetching new messages:", error);
        return [];
      }
    };

    sseManager.start(res, onData);

    return res.flushHeaders();
  }
}

export const apiHandler = new ResponseHandler();
