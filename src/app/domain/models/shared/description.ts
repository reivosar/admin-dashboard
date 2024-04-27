import { ensureNotNullOrEmpty } from "@/utils/validation";

export class Description {
  private readonly value: string | undefined | null;

  constructor(value: string | undefined | null) {
    this.value = value;
  }

  equals(other: Description): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value ?? "";
  }
}
