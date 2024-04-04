import { APIHandler } from "../../../api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { MyProfileService } from "@/services/my/profile";
import { getTokenFromCookie } from "../../../utils/cookie";

class MyProfileSectionHandler extends APIHandler {
  protected async handlePut(req: NextApiRequest, res: NextApiResponse) {
    const token = getTokenFromCookie(req);
    const section = Array.isArray(req.query.section)
      ? req.query.section[0]
      : (req.query.section as string);
    const { firstName, lastName, email, gender, birthdate } = req.body.formData;
    return (
      await MyProfileService.update(
        token,
        section,
        firstName,
        lastName,
        email,
        gender,
        birthdate
      )
    ).toResponse(res);
  }
}

export const apiHandler = new MyProfileSectionHandler();
