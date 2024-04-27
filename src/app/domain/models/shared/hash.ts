import { equals } from "@/utils/crypt";
import { ensureNotNullOrEmpty } from "@/utils/validation";
import crypto from "crypto";

export class Hash {
  private readonly hash: string;

  private constructor(hash: string) {
    this.hash = ensureNotNullOrEmpty(hash, "Hash");
  }

  static fromHashString(passwordHash: string): Hash {
    return new Hash(passwordHash);
  }

  static createFromPlainText(
    password: string,
    salt: string = crypto.randomBytes(16).toString("hex")
  ): Hash {
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return new Hash(`${salt}:${hash}`);
  }

  static createRandom(): Hash {
    const randomPassword = crypto.randomBytes(20).toString("hex");
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(randomPassword, salt, 1000, 64, "sha512")
      .toString("hex");
    return new Hash(`${salt}:${hash}`);
  }

  async verifyHash(normalString: string): Promise<boolean> {
    return await equals(normalString, this.hash);
  }

  asString(): string {
    return this.hash;
  }
}
