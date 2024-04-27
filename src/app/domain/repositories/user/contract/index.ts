import { UserId } from "@/app/domain/models/user/userId";
import { PersistentRepository } from "../..";
import { UserContact } from "../../../models/user/contact";
import { Email } from "@/app/domain/models/user/contact/email";

export interface UserContractRepository
  extends PersistentRepository<UserContact, UserId> {
  findByEmail(email: Email): Promise<UserContact | null>;
}
