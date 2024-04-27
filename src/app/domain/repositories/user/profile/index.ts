import { UserId } from "@/app/domain/models/user/userId";
import { PersistentRepository } from "../..";
import { UserProfile } from "../../../models/user/profile";

export interface UserProfileRepository
  extends PersistentRepository<UserProfile, UserId> {}
