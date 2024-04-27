import { ensureNotNull } from "@/utils/validation";
import { Description } from "../../../shared/description";
import { Name } from "../../../shared/name";
import { ChannelId } from "../../channeld";

export class ChannelProfile {
  private readonly channelId: ChannelId;
  private readonly name: Name;
  private readonly description: Description;

  constructor(channelId: ChannelId, name: Name, description: Description) {
    this.channelId = ensureNotNull(channelId, "ChannelId");
    this.name = ensureNotNull(name, "Name");
    this.description = ensureNotNull(description, "Description");
  }

  getChannelId(): ChannelId {
    return this.channelId;
  }

  getName(): Name {
    return this.name;
  }

  getDescription(): Description {
    return this.description;
  }

  equals(other: ChannelProfile): boolean {
    return this.channelId.equals(other.channelId);
  }

  changeName(name: Name): ChannelProfile {
    return new ChannelProfile(this.channelId, name, this.description);
  }

  changeDescription(description: Description): ChannelProfile {
    return new ChannelProfile(this.channelId, this.name, description);
  }
}
