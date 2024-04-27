import { ChannelMember } from "@/app/domain/models/message/channel/member";
import { ChannelMemberId } from "@/app/domain/models/message/channelMemberId";
import { PersistentRepository } from "../../..";

export interface ChannelMemberRepository
  extends PersistentRepository<ChannelMember, ChannelMemberId> {}
