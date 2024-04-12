import { NextApiRequest, NextApiResponse } from "next";
import { ServiceContext } from "@/types/shared/service-context";
import { APIError } from "@/errors";
import { logRequest } from "./api-log";
import { createServiceContext } from "./service-context-creator";

export class AuthenticatedApiHandler {
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
    const handler = this.getHandlerForMethod(req.method);
    if (!handler) {
      return this.methodNotAllowed(req, res);
    }
    let context;
    const startTime = new Date();
    try {
      context = await createServiceContext(req);
      await handler(req, res, context);
      logRequest(
        req,
        startTime,
        context.userId,
        undefined,
        res.statusCode,
        undefined
      );
    } catch (error) {
      this.handleError(req, res, startTime, context, error);
    }
  }

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

  private handleError(
    req: NextApiRequest,
    res: NextApiResponse,
    startTime: Date,
    context: ServiceContext | undefined,
    error: any
  ) {
    if (error instanceof APIError) {
      logRequest(
        req,
        startTime,
        context?.userId,
        "API Error",
        error.statusCode,
        error.message
      );
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      logRequest(
        req,
        startTime,
        context?.userId,
        "System Error",
        500,
        errorMessage
      );
      res.status(500).json({ message: errorMessage });
    }
  }
}
