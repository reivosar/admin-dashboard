import { ChannelProfile } from "@/app/domain/models/message/channel/profile";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { PersistentRepository } from "../../..";

export interface ChannelProfileRepository
  extends PersistentRepository<ChannelProfile, ChannelId> {}
