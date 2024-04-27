import { ensurePositiveInteger } from "@/utils/validation";

export class ChannelId {
  private readonly value: number;

  constructor(value: number) {
    this.value = ensurePositiveInteger(value, "ChannelId");
  }

  equals(other: ChannelId): boolean {
    return this.value === other.value;
  }

  asNumber(): number {
    return this.value;
  }
}
