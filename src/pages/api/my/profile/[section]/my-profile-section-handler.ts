import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromCookie } from "../../../../../utils/cookie";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";
import { container } from "@/container";
import { ServiceContext } from "@/types/shared/service-context";
import { UpdateMyProfileUseCase } from "@/app/usecases/my/updateMyProfileUsecase";

class MyProfileSectionHandler extends AuthenticatedApiHandler {
  constructor(
    private updateMyProfileUseCase = container.get(UpdateMyProfileUseCase)
  ) {
    super();
  }

  protected async handlePut(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const token = getTokenFromCookie(req);
    const section = Array.isArray(req.query.section)
      ? req.query.section[0]
      : (req.query.section as string);
    const { firstName, lastName, email, gender, birthdate } = req.body.formData;
    return (
      await this.updateMyProfileUseCase.execute(context, {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        birthDay: birthdate,
      })
    ).toResponse(res);
  }
}

export const apiHandler = new MyProfileSectionHandler();
