import { ClientType } from "./model/ClientType";
import { ActionEnvironment } from "./ActionEnvironment";
import { ECSSettings } from "./model/ECSSettings";
import { ConversationInfo } from "./model/ConversationInfo";

export interface ActionContext {
    hostType: ClientType;
    environment: ActionEnvironment;
    actionPackageId: string;
    actionInstanceId: string;
    tenantId: string;
    conversationInfo: ConversationInfo;
    userId: string;
    hostClientType: string;
    locale: string;
    theme: string;
    ecsSettings: ECSSettings;
    customProps: string;
    viewData: string;
}