import { ChannelMember } from "@/app/domain/models/message/channel/member";
import { ChannelMemberId } from "@/app/domain/models/message/channelMemberId";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { MemberId } from "@/app/domain/models/message/memberId";
import { ChannelMemberRepository } from "@/app/domain/repositories/message/channel/member";
import { TYPES } from "@/container/types";
import { ServiceContext } from "@/types/shared/serviceContext";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class PrismaChannelMemberRepository implements ChannelMemberRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async existsById(id: ChannelMemberId): Promise<boolean> {
    const channelMember = await this.prisma.messageChannelMember.findFirst({
      where: {
        channel_id: id.getChannelId().asNumber(),
        user_id: id.getMemberId().asNumber(),
      },
    });
    return channelMember !== null;
  }

  async findById(id: ChannelMemberId): Promise<ChannelMember | null> {
    const channelMember = await this.prisma.messageChannelMember.findUnique({
      where: {
        channel_id_user_id: {
          channel_id: id.getChannelId().asNumber(),
          user_id: id.getMemberId().asNumber(),
        },
      },
    });
    if (!channelMember) return null;
    return new ChannelMember(
      new ChannelMemberId(
        new ChannelId(channelMember.channel_id),
        new MemberId(channelMember.user_id)
      ),
      channelMember.can_post,
      channelMember.can_view,
      channelMember.can_edit,
      channelMember.can_delete
    );
  }

  async save(context: ServiceContext, entity: ChannelMember): Promise<void> {
    await this.prisma.messageChannelMember.upsert({
      where: {
        channel_id_user_id: {
          channel_id: entity.getChannelId().asNumber(),
          user_id: entity.getMemberId().asNumber(),
        },
      },
      create: {
        channel_id: entity.getChannelId().asNumber(),
        user_id: entity.getMemberId().asNumber(),
        can_post: entity.canMemberPost(),
        can_view: entity.canMemberView(),
        can_edit: entity.canMemberEdit(),
        can_delete: entity.canMemberDelete(),
        joined_by: context.userId.toString(),
      },
      update: {
        can_post: entity.canMemberPost(),
        can_view: entity.canMemberView(),
        can_edit: entity.canMemberEdit(),
        can_delete: entity.canMemberDelete(),
      },
    });
  }

  async delete(id: ChannelMemberId): Promise<void> {
    await this.prisma.messageChannelMember.delete({
      where: {
        channel_id_user_id: {
          channel_id: id.getChannelId().asNumber(),
          user_id: id.getMemberId().asNumber(),
        },
      },
    });
  }
}
