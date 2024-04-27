import { ensureNotNull } from "@/utils/validation";
import { UserId } from "./userId";

export class User {
  private readonly userId: UserId;

  constructor(userId: UserId) {
    this.userId = ensureNotNull(userId, "UserId");
  }

  equals(other: User): boolean {
    return this.userId.equals(other.userId);
  }
}
