import { Description } from "@/app/domain/models/shared/description";
import { Name } from "@/app/domain/models/shared/name";
import { ServiceContext } from "@/types/shared/service-context";

export interface ChannelFactory {
  create(
    context: ServiceContext,
    name: Name,
    description: Description,
    isPublic: boolean
  ): Promise<void>;
}
