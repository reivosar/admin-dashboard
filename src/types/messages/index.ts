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
  sendedBy?: number | null;
  sendedAt: Date;
}
