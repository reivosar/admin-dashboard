import { ensureNotNull } from "@/utils/validation";
import { ChannelId } from "./channeld";
import { MemberId } from "./memberId";

export class ChannelMemberId {
  private readonly channelId: ChannelId;
  private readonly memberId: MemberId;

  constructor(channelId: ChannelId, memberId: MemberId) {
    this.channelId = ensureNotNull(channelId, "ChannelId");
    this.memberId = ensureNotNull(memberId, "MemberId");
  }

  equals(other: ChannelMemberId): boolean {
    return (
      this.channelId === other.channelId && this.memberId === other.memberId
    );
  }

  getChannelId() {
    return this.channelId;
  }

  getMemberId() {
    return this.memberId;
  }
}
