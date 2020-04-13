import { ActionInstanceStatus } from "./ActionInstanceStatus";
import { Visibility } from "./Visibility";
import { ActionInstanceProperty } from "./ActionInstanceProperty";
export interface ActionInstanceUpdateInfo {
    version: number;
    title?: string;
    expiry?: number;
    status?: ActionInstanceStatus;
    rowsVisibility?: Visibility;
    sendReminderVisibility?: Visibility;
    properties?: ActionInstanceProperty[];
    notifyUsers?: string[];
    notificationMessage?: string;
}
