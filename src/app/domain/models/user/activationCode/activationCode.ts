import { generateRandomString, equals } from "@/utils/crypt";
import { ensureNotNullOrEmpty } from "@/utils/validation";

export class ActivationCode {
  private readonly value: string;

  constructor(value: string) {
    this.value = ensureNotNullOrEmpty(value, "ActivationCode");
  }

  static genereteCode(): string {
    return generateRandomString();
  }

  equals(other: ActivationCode): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
