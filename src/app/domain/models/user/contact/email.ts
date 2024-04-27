import { ensureEmail } from "@/utils/validation";

export class Email {
  private readonly value: string;

  constructor(value: string) {
    this.value = ensureEmail(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
