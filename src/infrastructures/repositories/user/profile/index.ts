import { UserProfile } from "@/app/domain/models/user/profile";
import { Birthday } from "@/app/domain/models/user/profile/birthday";
import { Gender } from "@/app/domain/models/user/profile/gender";
import { UserName } from "@/app/domain/models/user/profile/name";
import { UserId } from "@/app/domain/models/user/userId";
import { UserProfileRepository } from "@/app/domain/repositories/user/profile";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/service-context";
import { $Enums, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserProfileRepository implements UserProfileRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: UserId): Promise<boolean> {
    const userProfile = await this.prisma.userProfile.findFirst({
      where: {
        user_id: id.asNumber(),
      },
    });
    return userProfile !== null;
  }

  async findById(id: UserId): Promise<UserProfile | null> {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: {
        user_id: id.asNumber(),
      },
    });
    if (!userProfile) return null;
    return new UserProfile(
      new UserId(userProfile.user_id),
      new UserName(userProfile.first_name, userProfile.last_name),
      new Birthday(userProfile.birth_date),
      new Gender(userProfile.gender)
    );
  }

  async save(context: ServiceContext, entity: UserProfile): Promise<void> {
    await this.prisma.userProfile.upsert({
      where: {
        user_id: entity.getUserId().asNumber(),
      },
      create: {
        user_id: entity.getUserId().asNumber(),
        first_name: entity.getUserName().first(),
        last_name: entity.getUserName().last(),
        birth_date: new Date(entity.geBirthDay().asDate()),
        gender: entity.getGender().asString() as $Enums.GenderType,
        created_by: context.userId.toString(),
      },
      update: {
        first_name: entity.getUserName().first(),
        last_name: entity.getUserName().last(),
        birth_date: new Date(entity.geBirthDay().asDate()),
        gender: entity.getGender().asString() as $Enums.GenderType,
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.userProfile.delete({
      where: {
        user_id: id.asNumber(),
      },
    });
  }
}
