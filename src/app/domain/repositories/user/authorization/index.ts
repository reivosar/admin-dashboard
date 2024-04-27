import { UserId } from "@/app/domain/models/user/userId";
import { PersistentRepository } from "../..";
import { UserAuthorization } from "../../../models/user/authorization";
import { AuthId } from "@/app/domain/models/user/authorization/authid";

export interface UserAuthorizationRepository
  extends PersistentRepository<UserAuthorization, UserId> {
  findByAuthId(authId: AuthId): Promise<UserAuthorization | null>;
}
