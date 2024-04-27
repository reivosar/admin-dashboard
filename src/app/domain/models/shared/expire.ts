import { ensureFutureDate } from "@/utils/validation";

export class Expire {
  private readonly date: Date;

  private constructor(date: Date) {
    this.date = ensureFutureDate(date, "Expiration date");
  }

  static fromHours(hours: number): Expire {
    const date = new Date(Date.now() + hours * 3600000);
    return new Expire(date);
  }

  static fromDate(date: Date): Expire {
    return new Expire(date);
  }

  hasExpired(): boolean {
    return new Date() > this.date;
  }

  asDate(): Date {
    return this.date;
  }
}
