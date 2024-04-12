import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/services/users/user-service";
import { AuthenticatedApiHandler } from "../../authenticated-api-handler";

class UserNameHandler extends AuthenticatedApiHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const searchQuery = req.query["name"] as string | undefined;
    return (await UserService.getUserNames(searchQuery)).toResponse(res);
  }
}

export const apiHanlder = new UserNameHandler();
