interface ApiResourceProfile {
  id: number;
  resource_id: number;
  endpoint: string;
  method: string;
}

interface PageResourceProfile {
  id: number;
  resource_id: number;
  name: string;
}

interface ResourceDetails {
  api_resources: ApiResourceProfile[];
  page_resources: PageResourceProfile[];
}

interface ActionDetails {
  id: number;
  action_profiles: {
    action_id: number;
    name?: string;
  };
  action_resources: {
    action_id: number;
    resource_id: number;
    resource: ResourceDetails;
  }[];
}

interface RolePermissions {
  roleId: number;
  role_actions: {
    role_id: number;
    action_id: number;
    Action: ActionDetails;
  }[];
}

export interface UserRolesWithPermissions {
  user_id: number;
  role_id: number;
  Role: RolePermissions;
}
