import { UserRolesWithPermissions } from "@/types/shared/userPermission";

export interface PermissionQueryService {
  getUserPermissions(
    userId: number
  ): Promise<UserRolesWithPermissions[] | null>;
}
