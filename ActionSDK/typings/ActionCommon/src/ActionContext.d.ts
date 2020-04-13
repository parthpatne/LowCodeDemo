import { ClientType } from "./model/ClientType";
import { ActionEnvironment } from "./ActionEnvironment";
export interface ActionContext {
    hostType: ClientType;
    environment: ActionEnvironment;
    actionInstanceId: string;
    tenantId: string;
    groupId: string;
    groupAADId: string;
    userId: string;
    hostClientType: string;
    locale: string;
    theme: string;
}
