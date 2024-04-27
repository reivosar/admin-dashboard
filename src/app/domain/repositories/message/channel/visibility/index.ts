import { ChannelVisibility } from "@/app/domain/models/message/channel/visibility";
import { ChannelId } from "@/app/domain/models/message/channeld";
import { PersistentRepository } from "../../..";

export interface ChannelVisibilityRepository
  extends PersistentRepository<ChannelVisibility, ChannelId> {}
