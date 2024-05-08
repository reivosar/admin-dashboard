import { ChannelFactory } from "@/app/domain/factories/message/channel";
import { MessageContentFactory } from "@/app/domain/factories/message/content";
import { ChannelMemberRepository } from "@/app/domain/repositories/message/channel/member";
import { ChannelProfileRepository } from "@/app/domain/repositories/message/channel/profile";
import { ChannelVisibilityRepository } from "@/app/domain/repositories/message/channel/visibility";
import { MessageContentRepository } from "@/app/domain/repositories/message/content";
import { ChannelQueryService } from "@/app/services/query/message/channel";
import { MessageResponseQueryService } from "@/app/services/query/message/response";
import { CreateChannelUseCase } from "@/app/usecases/message/createChannelUseCase";
import { GetChannelMessagesUseCase } from "@/app/usecases/message/getChannelMessagesUseCase";
import { GetChannelsUseCase } from "@/app/usecases/message/getChannelsUseCase";
import { SendMessageUseCase } from "@/app/usecases/message/sendMessageUseCase";
import { UpdateChannelProfileUseCase } from "@/app/usecases/message/updateChannelProfileUseCase";
import { UpdateChannelVisibilityUseCase } from "@/app/usecases/message/updateChannelVisibilityUseCase";
import { PrismaChannelFactory } from "@/infrastructures/factories/message/channel";
import { PrismaMessageContentFactory } from "@/infrastructures/factories/message/content";
import { PrismaChannelQueryService } from "@/infrastructures/services/query/message/channel";
import { PrismaMessageResponseQueryService } from "@/infrastructures/services/query/message/response";
import { PrismaChannelMemberRepository } from "@/infrastructures/repositories/message/channel/member";
import { PrismaChannelProfileRepository } from "@/infrastructures/repositories/message/channel/profile";
import { PrismaChannelVisibilityRepository } from "@/infrastructures/repositories/message/channel/visibility";
import { PrismaMessageContentRepository } from "@/infrastructures/repositories/message/content";
import { Container } from "inversify";

export const MessageContainer = {
  dependencyInjecton(container: Container) {
    // UseCase
    container.bind(CreateChannelUseCase).toSelf();
    container.bind(GetChannelsUseCase).toSelf();
    container.bind(GetChannelMessagesUseCase).toSelf();
    container.bind(SendMessageUseCase).toSelf();
    container.bind(UpdateChannelProfileUseCase).toSelf();
    container.bind(UpdateChannelVisibilityUseCase).toSelf();

    // Factory
    container.bind<ChannelFactory>("ChannelFactory").to(PrismaChannelFactory);
    container
      .bind<MessageContentFactory>("MessageContentFactory")
      .to(PrismaMessageContentFactory);

    // Query
    container
      .bind<ChannelQueryService>("ChannelQueryService")
      .to(PrismaChannelQueryService);
    container
      .bind<MessageResponseQueryService>("MessageResponseQueryService")
      .to(PrismaMessageResponseQueryService);

    // Repository
    container
      .bind<ChannelMemberRepository>("ChannelMemberRepository")
      .to(PrismaChannelMemberRepository);
    container
      .bind<ChannelProfileRepository>("ChannelProfileRepository")
      .to(PrismaChannelProfileRepository);
    container
      .bind<ChannelVisibilityRepository>("ChannelVisibilityRepository")
      .to(PrismaChannelVisibilityRepository);
    container
      .bind<ChannelMemberRepository>("ChannelMemberRepository")
      .to(PrismaChannelMemberRepository);
    container
      .bind<MessageContentRepository>("MessageContentRepository")
      .to(PrismaMessageContentRepository);
  },
};
