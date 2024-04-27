export enum ContentTypeEnum {
  Text = "text",
  Link = "link",
  Image = "image",
  Video = "video",
}

export class ContentType {
  private readonly value: ContentTypeEnum;

  constructor(value: string) {
    const normalizedInput = value.trim().toLowerCase();
    if (
      !Object.values(ContentTypeEnum).includes(
        normalizedInput as ContentTypeEnum
      )
    ) {
      throw new Error(
        "Invalid content type value. Accepted values are: " +
          Object.values(ContentTypeEnum).join(", ") +
          "."
      );
    }
    this.value = normalizedInput as ContentTypeEnum;
  }

  equals(other: ContentType): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
