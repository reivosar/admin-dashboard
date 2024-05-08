import { UserRolesWithPermissions } from "./userPermission";

export interface ServiceContext {
  userId: number;
  permissions?: UserRolesWithPermissions[];
  requestId: string;
  requestStartedAt: Date;
  locale?: string;
  evaluatePolicy?: (action: string, resource: string) => boolean;
}
