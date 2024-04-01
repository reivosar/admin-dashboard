import type { NextApiRequest, NextApiResponse } from "next";
import { APIHandler } from "../../api-handler";
import { UserService } from "@/services/users/user-service";
import { BadRequestError } from "@/errors";

class UserIdHandler extends APIHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const id = this.getId(req);
    return (await UserService.getUser(id)).toResponse(res);
  }

  protected async handlePut(req: NextApiRequest, res: NextApiResponse) {
    const id = this.getId(req);
    const { username, email, gender, birthdate } = req.body.formData;
    return (
      await UserService.update(id, username, email, gender, birthdate)
    ).toResponse(res);
  }

  private getId(req: NextApiRequest) {
    const {
      query: { id },
    } = req;
    if (typeof id !== "number" || !id) {
      throw new BadRequestError(`table_name is required`);
    }
    return id;
  }
}

export const apiHanlder = new UserIdHandler();
