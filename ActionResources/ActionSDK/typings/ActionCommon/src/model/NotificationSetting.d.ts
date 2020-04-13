import { NotificationSettingMode } from "./NotificationSettingMode";
export interface NotificationSetting {
    mode: NotificationSettingMode;
    time?: number;
    message?: string;
}
