import { UserFactory } from "@/app/domain/factories/user";
import { Expire } from "@/app/domain/models/shared/expire";
import { ActivationCode } from "@/app/domain/models/user/activationCode/activationCode";
import { PasswordHash } from "@/app/domain/models/user/authorization/passwordHash";
import { Email } from "@/app/domain/models/user/contact/email";
import { Birthday } from "@/app/domain/models/user/profile/birthday";
import { Gender } from "@/app/domain/models/user/profile/gender";
import { UserName } from "@/app/domain/models/user/profile/name";
import type { UserContractRepository } from "@/app/domain/repositories/user/contract";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { ConflictError } from "@/utils/errors";
import { $Enums, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserFactory implements UserFactory {
  constructor(
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
    @inject("UserContractRepository")
    private userContractRepository: UserContractRepository
  ) {}
  async create(
    context: ServiceContext,
    userName: UserName,
    gender: Gender,
    birthday: Birthday,
    email: Email,
    password: PasswordHash
  ): Promise<void> {
    const emailExists = await this.userContractRepository.findByEmail(email);
    if (emailExists) {
      throw new ConflictError("Email already registered");
    }
    await this.prisma.user.create({
      data: {
        created_by: context.userId.toString(),
        user_profiles: {
          create: {
            first_name: userName.first(),
            last_name: userName.last(),
            birth_date: birthday.asDate(),
            gender: gender.asString() as $Enums.GenderType,
            created_by: context.userId.toString(),
          },
        },
        user_authorizations: {
          create: {
            auth_id: email.asString(),
            password_hash: password.asString(),
            created_by: context.userId.toString(),
          },
        },
        user_contacts: {
          create: {
            email: email.asString(),
            created_by: context.userId.toString(),
          },
        },
        user_activation_codes: {
          create: {
            activation_code: ActivationCode.genereteCode(),
            expires_at: Expire.fromHours(24).asDate(),
          },
        },
      },
    });
  }
}
