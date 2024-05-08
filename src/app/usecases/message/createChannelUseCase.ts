import type { ChannelFactory } from "@/app/domain/factories/message/channel";
import { Description } from "@/app/domain/models/shared/description";
import { Name } from "@/app/domain/models/shared/name";
import { ServiceContext } from "@/types/shared/serviceContext";
import { injectable, inject } from "inversify";
import { commandUseCaseOperation } from "../usecaseHelper";
import "reflect-metadata";

export interface CreateChannelUseCaseCommand {
  name: string;
  description?: string | null;
  isPublic: boolean;
  channelMembers?: {
    memberId: number;
    can_view: boolean;
    can_post: boolean;
    can_edit: boolean;
    can_delete: boolean;
  }[];
}

@injectable()
export class CreateChannelUseCase {
  constructor(
    @inject("ChannelFactory")
    private channelFactory: ChannelFactory
  ) {}

  execute(context: ServiceContext, request: CreateChannelUseCaseCommand) {
    return commandUseCaseOperation(async () => {
      this.channelFactory.create(
        context,
        new Name(request.name),
        new Description(request.description),
        request.isPublic
      );
    });
  }
}
