import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/services/users/user-service";
import { APIHandler } from "../../api-handler";

class UserNameHandler extends APIHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const searchQuery = req.query["name"] as string | undefined;
    return (await UserService.getUserNames(searchQuery)).toResponse(res);
  }
}

export const apiHanlder = new UserNameHandler();
