import type { UserTokenRepository } from "@/app/domain/repositories/user/token";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import { UserId } from "@/app/domain/models/user/userId";
import "reflect-metadata";

@injectable()
export class AuthCheckUseCase {
  constructor(
    @inject("UserTokenRepository")
    private userTokenRepository: UserTokenRepository
  ) {}

  async execute(context: ServiceContext, userId: number) {
    const token = await this.userTokenRepository.findById(new UserId(userId));
    if (!token) {
      return false;
    }
    return token.hasExpired();
  }
}
