import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError } from "@/utils/errors";
import { AnonymousApiHandler } from "../api-handler";
import { GetActivationUseCase } from "@/app/usecases/user/getActivationUseCase";
import { container } from "@/container";
import { ServiceContext } from "@/types/shared/serviceContext";
import { ActivateUserUseCase } from "@/app/usecases/user/activateUserUseCase";

class ActivationHandler extends AnonymousApiHandler {
  constructor(
    private getActivationUseCase = container.get(GetActivationUseCase),
    private activateUserUseCase = container.get(ActivateUserUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const {
      query: { code },
      method,
    } = req;

    if (typeof code !== "string" || !code) {
      throw new BadRequestError("Activaton code is required");
    }
    return (
      await this.getActivationUseCase.execute(context, { activationCode: code })
    ).toResponse(res);
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { activationCode, email, password } = req.body;

    if (!activationCode) {
      throw new BadRequestError("Activaton code is required");
    }

    return (
      await this.activateUserUseCase.execute(context, {
        activationCode,
        email,
        password,
      })
    ).toResponse(res);
  }
}

export const activationHandler = new ActivationHandler();
