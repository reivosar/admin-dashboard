import { NextApiRequest, NextApiResponse } from "next";
import { ActivationService } from "@/services/activation/activation-service";
import { BadRequestError } from "@/errors";
import { AnonymousApiHandler } from "../api-handler";

class ActivationHandler extends AnonymousApiHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const {
      query: { code },
      method,
    } = req;

    if (typeof code !== "string" || !code) {
      throw new BadRequestError("Activaton code is required");
    }
    return (await ActivationService.getActivation(code)).toResponse(res);
  }

  protected async handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { activationCode, email, password } = req.body;

    if (!activationCode) {
      throw new BadRequestError("Activaton code is required");
    }

    return (
      await ActivationService.activate(activationCode, email, password)
    ).toResponse(res);
  }
}

export const activationHandler = new ActivationHandler();
