import { ClientType } from "./ClientType";
import { ActionInstanceStatus } from "./ActionInstanceStatus";
import { ConversationInfo } from "./ConversationInfo";
import { Visibility } from "./Visibility";
import { NotificationSetting } from "./NotificationSetting";
import { ActionInstanceColumn } from "./ActionInstanceColumn";
import { ActionInstanceProperty } from "./ActionInstanceProperty";
export interface ActionInstance {
    clientType?: ClientType;
    /** Action Instance id, shouldn't be changed */
    id?: string;
    /** User id who created the action instance, shouldn't be changed */
    creatorId?: string;
    createTime?: number;
    updateTime?: number;
    /** Version of the action instance */
    version?: number;
    status?: ActionInstanceStatus;
    conversationInfo?: ConversationInfo;
    actionPackageId?: string;
    /** Action Instance title */
    title?: string;
    /** Expiry time of the form */
    expiry: number;
    rowsVisibility?: Visibility;
    sendReminderVisibility?: Visibility;
    isAnonymous?: boolean;
    canUserEditRows?: boolean;
    canUserAddMultipleRows?: boolean;
    notificationSettings?: NotificationSetting[];
    columns: ActionInstanceColumn[];
    properties: ActionInstanceProperty[];
}
