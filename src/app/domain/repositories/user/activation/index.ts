import { UserId } from "@/app/domain/models/user/userId";
import { PersistentRepository } from "../..";
import { UserActivation } from "@/app/domain/models/user/activation";

export interface UserActivationRepository
  extends PersistentRepository<UserActivation, UserId> {}
