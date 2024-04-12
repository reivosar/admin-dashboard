import { PermissionService } from "@/services/permissions/permission-service";
import { ServiceContext } from "@/types/shared/service-context";
import { UserRolesWithPermissions } from "@/types/shared/user-permission";
import { NextApiRequest } from "next";
import { getUseIdFromCookie } from "./utils/cookie";

function evaluatePolicy(
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

export async function createServiceContext(
  req: NextApiRequest
): Promise<ServiceContext> {
  const userId = getUseIdFromCookie(req);
  const permissions = (await PermissionService.getUserPermissions(userId)).data;
  const serviceContext: ServiceContext = {
    userId: userId,
    permissions: permissions ?? [],
    requestId: (req.headers["x-request-id"] as string) || crypto.randomUUID(),
    requestStartedAt: new Date(),
    locale: req.headers["accept-language"],
    evaluatePolicy: (action, resource) =>
      evaluatePolicy(permissions || [], action, resource),
  };
  return serviceContext;
}
