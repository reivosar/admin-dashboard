import { ensurePositiveInteger } from "@/utils/validation";

export class MessageId {
  private readonly value: number;

  constructor(value: number) {
    this.value = ensurePositiveInteger(value, "MessageId");
  }

  equals(other: MessageId): boolean {
    return this.value === other.value;
  }

  asNumber(): number {
    return this.value;
  }
}
