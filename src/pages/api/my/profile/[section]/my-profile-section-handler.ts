import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromCookie } from "../../../../../utils/cookie";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";
import { container } from "@/container";
import { ServiceContext } from "@/types/shared/service-context";
import { UpdateMyProfileUseCase } from "@/app/usecases/my/updateMyProfileUsecase";
import { UpdateMyContractUseCase } from "@/app/usecases/my/updateMyContractUsecase";

class MyProfileSectionHandler extends AuthenticatedApiHandler {
  constructor(
    private updateMyProfileUseCase = container.get(UpdateMyProfileUseCase),
    private updateMyContractUseCase = container.get(UpdateMyContractUseCase)
  ) {
    super();
  }

  protected async handlePut(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const section = Array.isArray(req.query.section)
      ? req.query.section[0]
      : (req.query.section as string);
    const { firstName, lastName, email, gender, birthdate } = req.body.formData;
    if (section === "email") {
      return (
        await this.updateMyContractUseCase.execute(context, {
          email: email,
        })
      ).toResponse(res);
    }
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
