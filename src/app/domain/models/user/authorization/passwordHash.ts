import { Hash } from "../../shared/hash";

export class PasswordHash {
  private readonly value: Hash;

  private constructor(value: Hash) {
    this.value = value;
  }

  static fromHashString(passwordHash: string): PasswordHash {
    return new PasswordHash(Hash.fromHashString(passwordHash));
  }

  static createFromPlainText(passwordHash: string): PasswordHash {
    return new PasswordHash(Hash.createFromPlainText(passwordHash));
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await this.value.verifyHash(password);
  }

  asString(): string {
    return this.value.asString();
  }
}
