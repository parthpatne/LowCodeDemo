import { ClientType } from "./ClientType";

export interface ConversationInfo {
    source: ClientType;
    parentId?: string;
    id: string;
    aadObjectId?: string;
    tenantId?: string;
    ServiceUrl?: string;
}
