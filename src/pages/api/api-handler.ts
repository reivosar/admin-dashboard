import { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "./middleware";

export class APIHandler {
  protected handleGet(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  protected handlePost(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  protected handlePut(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<any>> {
    return this.methodNotAllowed(req, res);
  }

  protected handleDelete(
    req: NextApiRequest,
    res: NextApiResponse
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
    switch (req.method) {
      case "GET":
        return withAuth(this.handleGet)(req, res);
      case "POST":
        return withAuth(this.handlePost)(req, res);
      case "PUT":
        return withAuth(this.handlePut)(req, res);
      case "DELETE":
        return withAuth(this.handleDelete)(req, res);
      default:
        return this.methodNotAllowed(req, res);
    }
  }
}
