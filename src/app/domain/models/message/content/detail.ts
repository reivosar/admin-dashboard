import { ensureNotNullOrEmpty } from "@/utils/validation";

export class ContentDetails {
  private readonly data: any;

  constructor(jsonData: string) {
    this.data = JSON.parse(ensureNotNullOrEmpty(jsonData, "JsonData"));
  }

  equals(other: ContentDetails): boolean {
    return this.data === other.data;
  }

  asJson(): string {
    return this.data;
  }
}
