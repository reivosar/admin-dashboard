import { ensureFutureDate } from "@/utils/validation";

export class Birthday {
  private readonly date: Date;

  constructor(date: Date) {
    this.date = ensureFutureDate(date, "Birthday");
  }

  equals(other: Birthday): boolean {
    return this.date === other.date;
  }

  asDate(): Date {
    return this.date;
  }

  toString(): string {
    return this.date.toISOString().substring(0, 10);
  }
}
