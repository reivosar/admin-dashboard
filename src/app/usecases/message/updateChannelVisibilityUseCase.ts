import type { ChannelProfileRepository } from "@/app/domain/repositories/message/channel/profile";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import "reflect-metadata";

export interface UpdateChannelVisibilityUseCaseCommand {
  channelId: number;
  isPublic: boolean;
}

@injectable()
export class UpdateChannelVisibilityUseCase {
  constructor(
    @inject("ChannelProfileRepository")
    private channelProfileRepository: ChannelProfileRepository
  ) {}

  execute(
    context: ServiceContext,
    request: UpdateChannelVisibilityUseCaseCommand
  ) {
    return commandUseCaseOperation(async () => {});
  }
}
