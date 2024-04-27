import { Hash } from "../../shared/hash";

export class TokenHash {
  private readonly value: Hash;

  private constructor(value: Hash) {
    this.value = value;
  }

  static fromHashString(passwordHash: string): TokenHash {
    return new TokenHash(Hash.fromHashString(passwordHash));
  }

  static createFromPlainText(passwordHash: string): TokenHash {
    return new TokenHash(Hash.createFromPlainText(passwordHash));
  }

  async verifyToken(token: string): Promise<boolean> {
    return await this.value.verifyHash(token);
  }

  asString(): string {
    return this.value.asString();
  }
}
