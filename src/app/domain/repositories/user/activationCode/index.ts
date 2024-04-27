import { UserId } from "@/app/domain/models/user/userId";
import { PersistentRepository } from "../..";
import { UserActivationCode } from "@/app/domain/models/user/activationCode";
import { ActivationCode } from "@/app/domain/models/user/activationCode/activationCode";

export interface UserActivationCodeRepository
  extends PersistentRepository<UserActivationCode, UserId> {
  findByActivationCode(
    activationCode: ActivationCode
  ): Promise<UserActivationCode | null>;
}
