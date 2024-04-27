export enum GenderType {
  Male = "male",
  Female = "female",
  Other = "other",
}

export class Gender {
  private readonly value: GenderType;

  constructor(value: string) {
    const normalizedInput = value.trim().toLowerCase();
    if (!Object.values(Gender).includes(normalizedInput as GenderType)) {
      throw new Error(
        "Invalid gender value. Accepted values are 'male', 'female', or 'other'."
      );
    }
    this.value = normalizedInput as GenderType;
  }

  equals(other: Gender): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
