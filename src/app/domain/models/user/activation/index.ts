import { UserId } from "../userId";
import { ensureNotNull } from "@/utils/validation";

export class UserActivation {
  private readonly userId: UserId;

  constructor(userId: UserId) {
    this.userId = ensureNotNull(userId, "UserId");
  }

  getUserId(): UserId {
    return this.userId;
  }
}
