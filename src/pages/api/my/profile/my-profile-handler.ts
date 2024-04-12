import { AuthenticatedApiHandler } from "../../authenticated-api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { MyProfileService } from "@/services/my/profile";
import { getTokenFromCookie } from "../../utils/cookie";

class MyProfileHandler extends AuthenticatedApiHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    const token = getTokenFromCookie(req);
    return (await MyProfileService.getProfile(token)).toResponse(res);
  }
}

export const apiHandler = new MyProfileHandler();
