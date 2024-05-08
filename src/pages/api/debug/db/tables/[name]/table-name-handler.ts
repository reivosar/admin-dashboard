import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedApiHandler } from "@/pages/api/api-handler";
import { container } from "@/container";
import { GetTableInfoUseCase } from "@/app/usecases/debug/getTableInfoUseCase";
import { ServiceContext } from "@/types/shared/serviceContext";

class TablesNameHandler extends AuthenticatedApiHandler {
  constructor(
    private getTableInfoUseCase = container.get(GetTableInfoUseCase)
  ) {
    super();
  }

  protected async handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) {
    const {
      query: { name },
      method,
    } = req;

    if (typeof name !== "string" || !name) {
      return res.status(400).end(`table_name is required`);
    }

    let conditions: Record<string, any> = [];

    Object.keys(req.query).forEach((key) => {
      if (key.startsWith("filter[")) {
        const match = key.match(/^filter\[(.*?)\]$/);
        const filterKey = match && match[1];
        if (filterKey) {
          const value = req.query[key];
          conditions[filterKey] = value;
        }
      }
    });

    const sort = Array.isArray(req.query.sort)
      ? req.query.sort[0]
      : req.query.sort;
    const direction = Array.isArray(req.query.direction)
      ? req.query.direction[0]
      : req.query.direction;

    return (
      await this.getTableInfoUseCase.execute(context, {
        tableName: name,
        conditions: conditions,
        sort: sort,
        direction: direction,
      })
    ).toResponse(res);
  }
}

export const apiHander = new TablesNameHandler();
