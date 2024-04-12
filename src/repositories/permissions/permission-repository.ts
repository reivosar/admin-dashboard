import { UserModelWithDetails } from "@/types/users";
import prisma from "../prisma";
import { UserRolesWithPermissions } from "@/types/shared/user-permission";

export const PermissionRepository = {
  async findUserPermissions(
    userId: number
  ): Promise<UserRolesWithPermissions[] | null> {
    const userRolesWithPermissions = await prisma.userRole.findMany({
      where: {
        user_id: userId,
      },
      select: {
        Role: {
          select: {
            role_actions: {
              select: {
                Action: {
                  select: {
                    action_profiles: true,
                    action_resources: {
                      select: {
                        resource: {
                          select: {
                            api_resources: true,
                            page_resources: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return userRolesWithPermissions;
  },
};
