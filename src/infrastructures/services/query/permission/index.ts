import { PermissionQueryService } from "@/app/services/query/permission";
import { TYPES } from "@/container/types";
import { UserRolesWithPermissions } from "@/types/shared/userPermission";
import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";

@injectable()
export class PrismaPermissionQueryService implements PermissionQueryService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}
  async getUserPermissions(
    userId: number
  ): Promise<UserRolesWithPermissions[] | null> {
    const userRolesData = await this.prisma.userRole.findMany({
      where: {
        user_id: userId,
      },
      include: {
        Role: {
          include: {
            role_actions: {
              include: {
                Action: {
                  include: {
                    action_profiles: true,
                    action_resources: {
                      include: {
                        resource: {
                          include: {
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

    const userRolesWithPermissions = userRolesData.map(({ Role }) => ({
      user_id: userId,
      role_id: Role.id,
      Role: {
        roleId: Role.id,
        role_actions: Role.role_actions.map(({ Action }) => ({
          role_id: Role.id,
          action_id: Action.id,
          Action: {
            id: Action.id,
            action_profiles: {
              action_id: Action.id,
              name: Action.action_profiles?.name,
            },
            action_resources: Action.action_resources.map(({ resource }) => ({
              action_id: Action.id,
              resource_id: resource.id,
              resource: {
                api_resources: resource.api_resources,
                page_resources: resource.page_resources,
              },
            })),
          },
        })),
      },
    }));

    return userRolesWithPermissions;
  }
}
