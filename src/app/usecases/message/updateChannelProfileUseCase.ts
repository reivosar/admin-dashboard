import type { ChannelProfileRepository } from "@/app/domain/repositories/message/channel/profile";
import { ServiceContext } from "@/types/shared/service-context";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import "reflect-metadata";

export interface UpdateChannelProfileUseCaseCommand {
  channelId: number;
  name: string;
  description?: string;
}

@injectable()
export class UpdateChannelProfileUseCase {
  constructor(
    @inject("ChannelProfileRepository")
    private channelProfileRepository: ChannelProfileRepository
  ) {}

  execute(
    context: ServiceContext,
    request: UpdateChannelProfileUseCaseCommand
  ) {
    return commandUseCaseOperation(async () => {});
  }
}
