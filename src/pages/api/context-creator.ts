import { ServiceContext } from "@/types/shared/service-context";
import { UserRolesWithPermissions } from "@/types/shared/user-permission";
import { NextApiRequest } from "next";
import { getUseIdFromCookie } from "../../utils/cookie";
import { inject, injectable } from "inversify";
import type { PermissionQueryService } from "@/app/services/query/permission";
import "reflect-metadata";

@injectable()
export class ContextCreator {
  constructor(
    @inject("PermissionQueryService")
    private permissionQueryService: PermissionQueryService
  ) {}

  evaluatePolicy(
    permissions: UserRolesWithPermissions[],
    actionRequested: string,
    resourceRequested: string
  ): boolean {
    return permissions.some((permission) =>
      permission.Role.role_actions.some(
        (roleAction) =>
          roleAction.Action.action_profiles.name === actionRequested &&
          roleAction.Action.action_resources.some(
            (actionResource) =>
              actionResource.resource.api_resources.some(
                (apiResource) =>
                  apiResource.endpoint === resourceRequested &&
                  apiResource.method === actionRequested
              ) ||
              actionResource.resource.page_resources.some(
                (pageResource) => pageResource.name === resourceRequested
              )
          )
      )
    );
  }

  async createIdentifiedServiceContext(
    req: NextApiRequest,
    startTime: Date
  ): Promise<ServiceContext> {
    const userId = getUseIdFromCookie(req);
    const permissions = await this.permissionQueryService.getUserPermissions(
      userId
    );
    const serviceContext: ServiceContext = {
      userId: userId,
      permissions: permissions ?? [],
      requestId: (req.headers["x-request-id"] as string) || crypto.randomUUID(),
      requestStartedAt: startTime,
      locale: req.headers["accept-language"],
      evaluatePolicy: (action, resource) =>
        this.evaluatePolicy(permissions || [], action, resource),
    };
    return serviceContext;
  }

  async createAnonymousServiceContext(
    req: NextApiRequest,
    startTime: Date
  ): Promise<ServiceContext> {
    const serviceContext: ServiceContext = {
      userId: 0,
      permissions: [],
      requestId: (req.headers["x-request-id"] as string) || crypto.randomUUID(),
      requestStartedAt: startTime,
      locale: req.headers["accept-language"],
    };
    return serviceContext;
  }
}
