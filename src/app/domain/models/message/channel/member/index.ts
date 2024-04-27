import { ensureNotNull } from "@/utils/validation";
import { ChannelMemberId } from "../../channelMemberId";

export class ChannelMember {
  private readonly channelMemberId: ChannelMemberId;
  private readonly canPost: boolean;
  private readonly canView: boolean;
  private readonly canEdit: boolean;
  private readonly canDelete: boolean;

  constructor(
    channelMemberId: ChannelMemberId,
    canPost: boolean = false,
    canView: boolean = false,
    canEdit: boolean = false,
    canDelete: boolean = false
  ) {
    this.channelMemberId = ensureNotNull(channelMemberId, "ChannelMemberId");
    this.canPost = canPost;
    this.canView = canView;
    this.canEdit = canEdit;
    this.canDelete = canDelete;
  }

  getChannelId() {
    return this.channelMemberId.getChannelId();
  }

  getMemberId() {
    return this.channelMemberId.getMemberId();
  }

  equals(other: ChannelMember): boolean {
    return this.channelMemberId.equals(other.channelMemberId);
  }

  changePermissions(
    canPost?: boolean,
    canView?: boolean,
    canEdit?: boolean,
    canDelete?: boolean
  ): ChannelMember {
    return new ChannelMember(
      this.channelMemberId,
      canPost ?? this.canPost,
      canView ?? this.canView,
      canEdit ?? this.canEdit,
      canDelete ?? this.canDelete
    );
  }

  canMemberPost(): boolean {
    return this.canPost;
  }

  canMemberView(): boolean {
    return this.canView;
  }

  canMemberEdit(): boolean {
    return this.canEdit;
  }

  canMemberDelete(): boolean {
    return this.canDelete;
  }
}
