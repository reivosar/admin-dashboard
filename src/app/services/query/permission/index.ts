import { UserRolesWithPermissions } from "@/types/shared/user-permission";

export interface PermissionQueryService {
  getUserPermissions(
    userId: number
  ): Promise<UserRolesWithPermissions[] | null>;
}
