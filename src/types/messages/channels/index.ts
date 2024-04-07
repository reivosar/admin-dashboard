export interface ChannelModel {
  id: number;
  name: string;
  isPublic: boolean;
  description?: string;
  created_at: Date;
}

export interface ChannelProfileModel {
  name: string;
  description?: string;
}

export interface ChannelVisibilityModel {
  isPublic: boolean;
}

export interface ChannelMemberModel {
  channelId: number;
  userId: number;
  can_view: boolean;
  can_post: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface ChannelMemberModel {
  userId: number;
  can_view: boolean;
  can_post: boolean;
  can_edit: boolean;
  can_delete: boolean;
}
