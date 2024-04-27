import { UserId } from "@/app/domain/models/user/userId";
import { PersistentRepository } from "../..";
import { UserToken } from "../../../models/user/token";

export interface UserTokenRepository
  extends PersistentRepository<UserToken, UserId> {}
