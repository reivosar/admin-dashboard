import { ensureNotNull } from "@/utils/validation";
import { ChannelId } from "../../channeld";

export class ChannelVisibility {
  private readonly channelId: ChannelId;
  private readonly isPublic: boolean;

  constructor(channelId: ChannelId, isPublic: boolean) {
    this.channelId = ensureNotNull(channelId, "ChannelId");
    this.isPublic = isPublic;
  }

  getChannelId(): ChannelId {
    return this.channelId;
  }

  equals(other: ChannelVisibility): boolean {
    return this.channelId.equals(other.channelId);
  }

  changeVisibility(isPublic: boolean): ChannelVisibility {
    return new ChannelVisibility(this.channelId, isPublic);
  }

  isPublicChannel(): boolean {
    return this.isPublic;
  }

  isPrivateChannel(): boolean {
    return !this.isPublic;
  }
}
