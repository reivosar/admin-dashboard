import { ServiceContext } from "@/types/shared/service-context";

export interface PersistentRepository<ENTITY, ID> {
  existsById(id: ID): Promise<boolean>;
  findById(id: ID): Promise<ENTITY | null>;
  save(context: ServiceContext, entity: ENTITY): Promise<void>;
  delete(id: ID): Promise<void>;
}
