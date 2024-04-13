import { NextApiRequest, NextApiResponse } from "next";
import { TablenService } from "@/services/debug/table-service";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";

class TablesListHandler extends AuthenticatedApiHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    return (await TablenService.getAllTables()).toResponse(res);
  }
}

export const apiHander = new TablesListHandler();
