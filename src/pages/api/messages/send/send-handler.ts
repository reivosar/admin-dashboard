import type { NextApiRequest, NextApiResponse } from "next";
import { ServiceContext } from "@/types/shared/service-context";
import { AuthenticatedApiHandler } from "../../api-handler";
import { container } from "@/container";
import { SendMessageUseCase } from "@/app/usecases/message/sendMessageUseCase";

class SendHandler extends AuthenticatedApiHandler {
  constructor(private sendMessageUseCase = container.get(SendMessageUseCase)) {
    super();
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { channelId, type, content } = req.body;
    return (
      await this.sendMessageUseCase.execute(context, {
        channelId: channelId,
        contentType: type,
        contentDetails: content,
      })
    ).toResponse(res);
  }
}

export const apiHandler = new SendHandler();
