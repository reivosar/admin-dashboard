import { ensurePositiveInteger } from "@/utils/validation";

export class MemberId {
  private readonly value: number;

  constructor(value: number) {
    this.value = ensurePositiveInteger(value, "MemberId");
  }

  equals(other: MemberId): boolean {
    return this.value === other.value;
  }

  asNumber(): number {
    return this.value;
  }
}
