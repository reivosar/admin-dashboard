import type { NextApiRequest, NextApiResponse } from "next";
import { SqlService } from "@/services/debug/sql-service";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";

class SQLExecuteHandler extends AuthenticatedApiHandler {
  protected async handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "SQL query is required" });
    }
    return (await SqlService.exectueSql(query)).toResponse(res);
  }
}

export const apiHander = new SQLExecuteHandler();
