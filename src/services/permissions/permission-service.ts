import { PermissionRepository } from "@/repositories/permissions/permission-repository";
import { queryServiceOperation } from "../service-helper";

export const PermissionService = {
  async getUserPermissions(userId: number) {
    return queryServiceOperation(
      PermissionRepository.findUserPermissions(userId)
    );
  },
};
