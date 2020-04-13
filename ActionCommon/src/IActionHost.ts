import { ActionSdkCommand } from "./ActionSdkCommand";

export interface IActionHost {
    // Host api to execute an ActionSDK command
    executeActionSDKApi(command: ActionSdkCommand, args: any[]): Promise<any>;

    // Host api to register an ActionSDK callback for a command
    registerActionSDKCallback(command: ActionSdkCommand, args: any[], callback: any): Promise<boolean>;
}