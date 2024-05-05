import { ensureNotNullOrEmpty } from "@/utils/validation";

export class ContentDetails {
  private readonly data: string;

  constructor(jsonData: string) {
    this.data = ensureNotNullOrEmpty(jsonData, "JsonData");
  }

  equals(other: ContentDetails): boolean {
    return this.data === other.data;
  }

  asJson(): string {
    return this.data;
  }
}
