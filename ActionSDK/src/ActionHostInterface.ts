import {
    ActionSdkCommand,
    IActionHost
} from "@actionCommon";

// Below will be set by the ActionHost page
declare let actionHost: IActionHost;

export namespace Host {
    // Communication towards host
    export async function executeActionSDKApi<T>(command: ActionSdkCommand, args: any[] = []): Promise<T> {
        if (!actionHost) {
            console.error("ActionHost is not set");
            return;
        }
        return actionHost.executeActionSDKApi(command, args);
    }

    export async function registerActionSDKCallback(command: ActionSdkCommand, args: any[] = [], handler: any): Promise<boolean> {
        if (!actionHost) {
            console.error("ActionHost is not set");
            return;
        }
        return actionHost.registerActionSDKCallback(command, args, handler);
    }
}
