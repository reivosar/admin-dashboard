import { User } from "@/app/domain/models/user";
import { UserId } from "@/app/domain/models/user/userId";
import { UserRepository } from "@/app/domain/repositories/user";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaUserRepository implements UserRepository {
  existsById(id: UserId): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  findById(id: UserId): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  save(context: ServiceContext, entity: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: UserId): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
