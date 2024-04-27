import { ensureNotNull } from "@/utils/validation";
import { UserId } from "../userId";
import { Email } from "./email";

export class UserContact {
  private readonly userId: UserId;
  private readonly email: Email;

  constructor(userId: UserId, email: Email) {
    this.userId = ensureNotNull(userId, "UserId");
    this.email = ensureNotNull(email, "Email");
  }

  getUserId(): UserId {
    return this.userId;
  }

  getEmail(): Email {
    return this.email;
  }

  changeEmail(email: Email): UserContact {
    return new UserContact(this.userId, email);
  }

  equals(other: UserContact): boolean {
    return this.userId.equals(other.userId);
  }
}
