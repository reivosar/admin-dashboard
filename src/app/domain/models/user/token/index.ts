import { Expire } from "../../shared/expire";
import { UserId } from "../userId";
import { ensureNotNull } from "@/utils/validation";
import { TokenHash } from "./tokenHash";
import { equals } from "@/utils/crypt";

export class UserToken {
  private readonly userId: UserId;
  private readonly tokenHash: TokenHash;
  private readonly expire: Expire;

  constructor(userId: UserId, tokenHash: TokenHash, expire: Expire) {
    this.userId = ensureNotNull(userId, "UserId");
    this.tokenHash = ensureNotNull(tokenHash, "TokenHash");
    this.expire = ensureNotNull(expire, "Expiration");
  }

  getUserId(): UserId {
    return this.userId;
  }

  getTokenHash(): TokenHash {
    return this.tokenHash;
  }

  getExpire(): Expire {
    return this.expire;
  }

  hasExpired(): boolean {
    return this.expire.hasExpired();
  }

  equals(other: UserToken): boolean {
    return this.userId.equals(other.userId);
  }
}
