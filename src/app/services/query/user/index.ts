import { ActivationUser } from "@/types/activation";
import { ServiceContext } from "@/types/shared/service-context";
import { UserModelWithDetails, UserNameModel } from "@/types/users";

export interface UserQueryService {
  getUserById(
    context: ServiceContext,
    id: number
  ): Promise<UserModelWithDetails | null>;

  getUsersBySearchTerm(
    context: ServiceContext,
    searchTerm: string | undefined
  ): Promise<UserModelWithDetails[]>;

  getUserNamesByName(
    context: ServiceContext,
    name: string | undefined
  ): Promise<UserNameModel[]>;

  getActivationUserByActivationCode(
    context: ServiceContext,
    activation_code: string
  ): Promise<ActivationUser | null>;
}
