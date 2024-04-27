import { ensurePositiveInteger } from "@/utils/validation";

export class UserId {
  private readonly value: number;

  constructor(value: number) {
    this.value = ensurePositiveInteger(value, "UserId");
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  asNumber(): number {
    return this.value;
  }
}
