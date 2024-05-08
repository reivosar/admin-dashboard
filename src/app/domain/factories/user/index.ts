import { ServiceContext } from "@/types/shared/serviceContext";
import { UserName } from "../../models/user/profile/name";
import { Email } from "../../models/user/contact/email";
import { PasswordHash } from "../../models/user/authorization/passwordHash";
import { Gender } from "../../models/user/profile/gender";
import { Birthday } from "../../models/user/profile/birthday";

export interface UserFactory {
  create(
    context: ServiceContext,
    userName: UserName,
    gender: Gender,
    birthday: Birthday,
    email: Email,
    password: PasswordHash
  ): Promise<void>;
}
