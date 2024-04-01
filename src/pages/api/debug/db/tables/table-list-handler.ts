import { NextApiRequest, NextApiResponse } from "next";
import { APIHandler } from "../../../api-handler";
import { TablenService } from "@/services/debug/table-service";

class TablesListHandler extends APIHandler {
  protected async handleGet(req: NextApiRequest, res: NextApiResponse) {
    return (await TablenService.getAllTables()).toResponse(res);
  }
}

export const apiHander = new TablesListHandler();
