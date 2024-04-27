import { ensureNotNullOrEmpty } from "@/utils/validation";

export class AuthId {
  private readonly value: string;

  constructor(value: string) {
    this.value = ensureNotNullOrEmpty(value, "AuhtId");
  }

  equals(other: AuthId): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
