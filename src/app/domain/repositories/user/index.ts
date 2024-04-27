import { PersistentRepository } from "..";
import { User } from "../../models/user";
import { UserId } from "../../models/user/userId";

export interface UserRepository extends PersistentRepository<User, UserId> {}
