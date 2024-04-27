import { ensureNotNull } from "@/utils/validation";
import { MessageId } from "../messageld";
import { ContentDetails } from "./detail";
import { ContentType } from "./type";
import { MemberId } from "../memberId";

export class MessageContent {
  private readonly messageId: MessageId;
  private readonly contentType: ContentType;
  private readonly contentDetails: ContentDetails;
  private readonly sendedBy: MemberId;

  constructor(
    messageId: MessageId,
    contentType: ContentType,
    contentData: ContentDetails,
    sendedBy: MemberId
  ) {
    this.messageId = ensureNotNull(messageId, "MessageId");
    this.contentType = ensureNotNull(contentType, "ContentType");
    this.contentDetails = ensureNotNull(contentData, "ContentDetails");
    this.sendedBy = ensureNotNull(sendedBy, "MemberId");
  }

  getMessageId(): MessageId {
    return this.messageId;
  }

  getContentType(): ContentType {
    return this.contentType;
  }

  getContentDetails(): ContentDetails {
    return this.contentDetails;
  }

  equals(other: MessageContent): boolean {
    return this.messageId.equals(other.messageId);
  }

  canEdit(memberId: MemberId): boolean {
    return this.sendedBy.equals(memberId);
  }

  editContent(newDetails: string): MessageContent {
    if (!this.canEdit(this.sendedBy)) {
      throw new Error("Unauthorized to edit this content.");
    }
    return new MessageContent(
      this.messageId,
      this.contentType,
      new ContentDetails(newDetails),
      this.sendedBy
    );
  }

  asJson(): string {
    return this.contentDetails.asJson();
  }
}
