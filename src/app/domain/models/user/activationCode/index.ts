import { Expire } from "../../shared/expire";
import { UserId } from "../userId";
import { ensureNotNull } from "@/utils/validation";
import { ActivationCode } from "./activationCode";

export class UserActivationCode {
  private readonly userId: UserId;
  private readonly activationCode: ActivationCode;
  private readonly expire: Expire;

  constructor(userId: UserId, activationCode: ActivationCode, expire: Expire) {
    this.userId = ensureNotNull(userId, "UserId");
    this.activationCode = ensureNotNull(activationCode, "ActivationCode");
    this.expire = ensureNotNull(expire, "Expiration");
  }

  getUserId(): UserId {
    return this.userId;
  }

  getActivationCode(): ActivationCode {
    return this.activationCode;
  }

  getExpiration(): Expire {
    return this.expire;
  }

  equals(other: UserActivationCode): boolean {
    return this.userId.equals(other.userId);
  }

  hasExpired() {
    return this.expire.hasExpired();
  }
}
