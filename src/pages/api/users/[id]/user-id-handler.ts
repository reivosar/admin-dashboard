import type { NextApiRequest, NextApiResponse } from "next";
import { APIHandler } from "../../api-handler";
import { UserService } from "@/services/users/user-service";

class UserIdHandler extends APIHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const parsedId = parseInt(id as string);
    return (await UserService.getUser(parsedId)).toResponse(res);
  }

  protected async handlePut(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const parsedId = parseInt(id as string);
    const { firstName, lastName, email, gender, birthdate } = req.body.formData;
    return (
      await UserService.update(
        parsedId,
        firstName,
        lastName,
        email,
        gender,
        birthdate
      )
    ).toResponse(res);
  }
}

export const apiHanlder = new UserIdHandler();
