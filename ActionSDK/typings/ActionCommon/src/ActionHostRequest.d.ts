import { ActionSdkCommand } from "./ActionSdkCommand";
export interface ActionHostRequest {
    correlationId: string;
    command: ActionSdkCommand;
    args: any[];
}
