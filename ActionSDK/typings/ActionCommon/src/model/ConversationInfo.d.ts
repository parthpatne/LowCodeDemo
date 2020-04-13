import { ClientType } from "./ClientType";
export interface ConversationInfo {
    source: ClientType;
    id: string;
    aadObjectId?: string;
    tenantId?: string;
}
