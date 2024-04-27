import { MessageId } from "@/app/domain/models/message/messageld";
import { MessageContent } from "@/app/domain/models/message/content";
import { PersistentRepository } from "../..";

export interface MessageContentRepository
  extends PersistentRepository<MessageContent, MessageId> {}
