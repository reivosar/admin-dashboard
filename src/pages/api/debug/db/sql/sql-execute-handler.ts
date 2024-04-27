import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";
import { container } from "@/container";
import { ExecuteSqlUseCase } from "@/app/usecases/debug/executeSqlUseCase";
import { ServiceContext } from "@/types/shared/service-context";

class SQLExecuteHandler extends AuthenticatedApiHandler {
  constructor(private executeSqlUseCase = container.get(ExecuteSqlUseCase)) {
    super();
  }

  protected async handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "SQL query is required" });
    }
    return (
      await this.executeSqlUseCase.execute(context, { sql: query })
    ).toResponse(res);
  }
}

export const apiHander = new SQLExecuteHandler();
