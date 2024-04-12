import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "../authenticated-api-handler";
import { ActivationService } from "@/services/activation/activation-service";

class ActivationHandler extends AuthenticatedApiHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const {
      query: { code },
      method,
    } = req;

    if (typeof code !== "string" || !code) {
      return res.status(400).end(`Activaton code is required`);
    }
    return (await ActivationService.getActivation(code)).toResponse(res);
  }

  protected async handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { activationCode, email, password } = req.body;

    if (!activationCode) {
      return res.status(400).json({ message: "Activaton code is required" });
    }

    return (
      await ActivationService.activate(activationCode, email, password)
    ).toResponse(res);
  }
}

export const activationHandler = new ActivationHandler();
