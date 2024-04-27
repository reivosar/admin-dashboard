import { ensureNotNullOrEmpty } from "@/utils/validation";

export class UserName {
  private readonly firstName: string;
  private readonly lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = ensureNotNullOrEmpty(firstName, "FirstName");
    this.lastName = ensureNotNullOrEmpty(lastName, "Lastname");
  }

  equals(other: UserName): boolean {
    return (
      this.firstName === other.firstName && this.lastName === other.lastName
    );
  }

  first(): string {
    return this.firstName;
  }

  last(): string {
    return this.lastName;
  }

  toString(): string {
    return this.firstName + " " + this.lastName;
  }
}
