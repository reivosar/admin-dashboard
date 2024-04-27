import { ensureNotNull } from "@/utils/validation";
import { AuthId } from "./authid";
import { UserId } from "../userId";
import { PasswordHash } from "./passwordHash";

export class UserAuthorization {
  private readonly userId: UserId;
  private readonly authId: AuthId;
  private readonly passwordHash: PasswordHash;
  private readonly initialPassword: boolean;

  constructor(
    userId: UserId,
    authId: AuthId,
    passwordHash: PasswordHash,
    initialPassword: boolean
  ) {
    this.userId = ensureNotNull(userId, "UserId");
    this.authId = ensureNotNull(authId, "AuthId");
    this.passwordHash = ensureNotNull(passwordHash, "PasswordHash");
    this.initialPassword = initialPassword;
  }

  equals(other: UserAuthorization): boolean {
    return this.userId.equals(other.userId);
  }

  getUserId(): UserId {
    return this.userId;
  }

  getAuthId(): AuthId {
    return this.authId;
  }

  isInitialPassword(): boolean {
    return this.initialPassword;
  }

  getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  verifyAuthId(authId: AuthId): boolean {
    return this.authId.equals(authId);
  }

  verifyPassword(password: string): Promise<boolean> {
    return this.passwordHash.verifyPassword(password);
  }

  changeAuthId(authId: AuthId): UserAuthorization {
    return new UserAuthorization(
      this.userId,
      authId,
      this.passwordHash,
      this.initialPassword
    );
  }

  changePasswordHash(passwordHash: PasswordHash): UserAuthorization {
    return new UserAuthorization(this.userId, this.authId, passwordHash, false);
  }
}
