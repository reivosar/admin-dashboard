import { NextApiRequest, NextApiResponse } from "next";
import { ServiceContext } from "@/types/shared/service-context";
import { logRequest } from "./api-log";
import {
  createAnonymousServiceContext,
  createIdentifiedServiceContext,
} from "./service-context-creator";
import { handleError } from "./api-error-handler";
import { log } from "console";

abstract class ApiHandler {
  protected handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  protected handlePost(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  protected handlePut(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  protected handleDelete(
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  private methodNotAllowed(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return Promise.resolve();
  }

  public async handleRequest(req: NextApiRequest, res: NextApiResponse) {
    const startTime = new Date();
    const handler = this.getHandlerForMethod(req.method);
    if (!handler) {
      return this.methodNotAllowed(req, res);
    }
    let context;
    try {
      context = await this.createServiceContext(req, startTime);
      await handler(req, res, context);
      logRequest(
        req,
        startTime,
        context.userId !== 0 ? context.userId : undefined,
        undefined,
        res.statusCode,
        undefined
      );
    } catch (error) {
      handleError(
        req,
        res,
        startTime,
        context?.userId !== 0 ? context?.userId : undefined,
        error
      );
    }
  }

  protected abstract createServiceContext(
    req: NextApiRequest,
    startTime: Date
  ): Promise<ServiceContext>;

  private getHandlerForMethod(
    method: string | undefined
  ): (
    req: NextApiRequest,
    res: NextApiResponse,
    context: ServiceContext
  ) => Promise<void | NextApiResponse<any>> {
    switch (method) {
      case "GET":
        return this.handleGet.bind(this);
      case "POST":
        return this.handlePost.bind(this);
      case "PUT":
        return this.handlePut.bind(this);
      case "DELETE":
        return this.handleDelete.bind(this);
      default:
        return this.methodNotAllowed.bind(this);
    }
  }
}

export class AnonymousApiHandler extends ApiHandler {
  protected async createServiceContext(
    req: NextApiRequest,
    startTime: Date
  ): Promise<ServiceContext> {
    return await createAnonymousServiceContext(req, startTime);
  }
}

export class AuthenticatedApiHandler extends ApiHandler {
  protected async createServiceContext(
    req: NextApiRequest,
    startTime: Date
  ): Promise<ServiceContext> {
    return await createIdentifiedServiceContext(req, startTime);
  }
}
