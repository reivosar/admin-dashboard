import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "@/services/users/user-service";
import { AuthenticatedApiHandler } from "../api-handler";

class UserHandler extends AuthenticatedApiHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const searchQuery = req.query["filter[searchTerm]"] as string | undefined;
    return (await UserService.getUserBySearchTerm(searchQuery)).toResponse(res);
  }

  protected async handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { firstName, lastName, email, password, gender, birthdate } =
      req.body;
    return (
      await UserService.create(
        firstName,
        lastName,
        email,
        password,
        gender,
        birthdate
      )
    ).toResponse(res);
  }

  protected async handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid request data." });
    }
    return (await UserService.delete(userIds)).toResponse(res);
  }
}

export const apiHanlder = new UserHandler();
