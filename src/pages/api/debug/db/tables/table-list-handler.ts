import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";
import { container } from "@/container";
import { GetAllTablesUseCase } from "@/app/usecases/debug/getAllTablesUseCase";
import { ServiceContext } from "@/types/shared/serviceContext";

class TablesListHandler extends AuthenticatedApiHandler {
  constructor(
    private getAllTablesUseCase = container.get(GetAllTablesUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    return (await this.getAllTablesUseCase.execute(context)).toResponse(res);
  }
}

export const apiHandler = new TablesListHandler();
