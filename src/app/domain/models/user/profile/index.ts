import { Gender } from "./gender";
import { Birthday as BirthDay } from "./birthday";
import { UserName } from "./name";
import { UserId } from "../userId";
import { ensureNotNull } from "@/utils/validation";

export class UserProfile {
  private readonly userId: UserId;
  private readonly userName: UserName;
  private readonly birthDay: BirthDay;
  private readonly gender: Gender;

  constructor(
    userId: UserId,
    userName: UserName,
    birthDay: BirthDay,
    gender: Gender
  ) {
    this.userId = ensureNotNull(userId, "UserId");
    this.userName = ensureNotNull(userName, "Username");
    this.birthDay = ensureNotNull(birthDay, "Birthday");
    this.gender = ensureNotNull(gender, "Gender");
  }

  getUserId(): UserId {
    return this.userId;
  }

  getUserName(): UserName {
    return this.userName;
  }

  geBirthDay(): BirthDay {
    return this.birthDay;
  }

  getGender(): Gender {
    return this.gender;
  }

  equals(other: UserProfile): boolean {
    return this.userId.equals(other.userId);
  }

  changeUserName(
    firstName: string | undefined,
    lastName: string | undefined
  ): UserProfile {
    return new UserProfile(
      this.userId,
      new UserName(
        firstName ?? this.userName.first(),
        lastName ?? this.userName.last()
      ),
      this.birthDay,
      this.gender
    );
  }

  changeBirthDay(birthDay: Date | undefined): UserProfile {
    return new UserProfile(
      this.userId,
      this.userName,
      new BirthDay(birthDay ?? this.birthDay.asDate()),
      this.gender
    );
  }

  changeGender(genderType: string | undefined): UserProfile {
    return new UserProfile(
      this.userId,
      this.userName,
      this.birthDay,
      new Gender(genderType ?? this.gender.asString())
    );
  }
}
