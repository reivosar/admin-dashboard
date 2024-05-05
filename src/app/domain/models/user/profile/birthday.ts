import { ensurePastDate } from "@/utils/validation";

export class Birthday {
  private readonly date: Date;

  constructor(date: Date) {
    this.date = ensurePastDate(date, "Birthday");
  }

  equals(other: Birthday): boolean {
    return this.date === other.date;
  }

  asDate(): Date {
    return this.date;
  }
}
