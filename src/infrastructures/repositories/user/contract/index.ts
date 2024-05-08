import { UserContact } from "@/app/domain/models/user/contact";
import { Email } from "@/app/domain/models/user/contact/email";
import { UserId } from "@/app/domain/models/user/userId";
import { UserContractRepository } from "@/app/domain/repositories/user/contract";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserContractRepository implements UserContractRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findByEmail(email: Email): Promise<UserContact | null> {
    const userContact = await this.prisma.userContact.findFirst({
      where: {
        email: email.asString(),
      },
    });
    if (!userContact) return null;
    return new UserContact(
      new UserId(userContact.user_id),
      new Email(userContact.email)
    );
  }

  async existsById(id: UserId): Promise<boolean> {
    const userContact = await this.prisma.userContact.findFirst({
      where: {
        user_id: id.asNumber(),
      },
    });
    return userContact !== null;
  }

  async findById(id: UserId): Promise<UserContact | null> {
    const userContact = await this.prisma.userContact.findUnique({
      where: {
        user_id: id.asNumber(),
      },
    });
    if (!userContact) return null;
    return new UserContact(
      new UserId(userContact.user_id),
      new Email(userContact.email)
    );
  }

  async save(context: ServiceContext, entity: UserContact): Promise<void> {
    await this.prisma.userContact.upsert({
      where: {
        user_id: entity.getUserId().asNumber(),
      },
      create: {
        user_id: entity.getUserId().asNumber(),
        email: entity.getEmail().asString(),
        created_by: context.userId.toString(),
      },
      update: {
        email: entity.getEmail().asString(),
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.userContact.delete({
      where: {
        user_id: id.asNumber(),
      },
    });
  }
}
