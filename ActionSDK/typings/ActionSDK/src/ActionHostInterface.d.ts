import { ActionSdkCommand } from "@actionCommon";
export declare namespace Host {
    function invokeCommand<T>(command: ActionSdkCommand, args?: any[]): Promise<T>;
}
