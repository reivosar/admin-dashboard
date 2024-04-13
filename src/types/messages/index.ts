export type MessageContentType = "text" | "link" | "image" | "video";

export interface MessageRequest {
  channelId: number;
  content?: {
    type: MessageContentType;
    content: any;
  };
}

export interface MessageResponse {
  channelId: number;
  id: number;
  content: any;
  contentType: MessageContentType;
  isOwnMessage: boolean;
  sendedBy?: {
    id?: number | null;
    name?: string | null;
  };
  sendedAt: Date;
}
