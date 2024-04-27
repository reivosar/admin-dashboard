import { ensureNotNullOrEmpty } from "@/utils/validation";

export class Name {
  private readonly value: string;

  constructor(value: string) {
    this.value = ensureNotNullOrEmpty(value, "Name");
  }

  equals(other: Name): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
