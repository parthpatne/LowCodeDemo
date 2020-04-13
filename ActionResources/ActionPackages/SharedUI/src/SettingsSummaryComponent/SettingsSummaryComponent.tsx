import * as React from "react";
import { UxUtils } from "../common";
import * as ActionSDK from "@actionSDK";
import { Icon, Text } from "@stardust-ui/react";
import { ResultVisibility, NotificationSettings, NotificationSettingMode } from "../SettingsComponent";
import './SettingsSummaryComponent.scss';

export interface ISettingsSummaryProps {
    dueDate?: Date;
    resultVisibility?: ResultVisibility;
    notificationSettings?: NotificationSettings;
    onRef?: (element: HTMLElement) => void;
    onClick?: () => void;
    showDefaultTitle?: boolean;
}

export class SettingsSummaryComponent extends React.Component<ISettingsSummaryProps> {
    isFocused: boolean = false;

    updateSettingsSummary(): string {
        let settingsStrings: string[] = [];
        if (this.props.dueDate) {
            let dueIn: {} = ActionSDK.Utils.getTimeRemaining(this.props.dueDate);
            if (dueIn[ActionSDK.Utils.YEARS] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.YEARS] == 1 ? "DueInYear" : "DueInYears", dueIn[ActionSDK.Utils.YEARS]));
            }
            else if (dueIn[ActionSDK.Utils.MONTHS] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.MONTHS] == 1 ? "DueInMonth" : "DueInMonths", dueIn[ActionSDK.Utils.MONTHS]));
            }
            else if (dueIn[ActionSDK.Utils.WEEKS] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.WEEKS] == 1 ? "DueInWeek" : "DueInWeeks", dueIn[ActionSDK.Utils.WEEKS]));
            }
            else if (dueIn[ActionSDK.Utils.DAYS] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.DAYS] == 1 ? "DueInDay" : "DueInDays", dueIn[ActionSDK.Utils.DAYS]));
            }
            else if (dueIn[ActionSDK.Utils.HOURS] > 0 && dueIn[ActionSDK.Utils.MINUTES] > 0) {
                if (dueIn[ActionSDK.Utils.HOURS] == 1 && dueIn[ActionSDK.Utils.MINUTES] == 1) {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHourAndMinute", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                } else if (dueIn[ActionSDK.Utils.HOURS] == 1) {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHourAndMinutes", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                } else if (dueIn[ActionSDK.Utils.MINUTES] == 1) {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHoursAndMinute", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                } else {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHoursAndMinutes", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                }
            }
            else if (dueIn[ActionSDK.Utils.HOURS] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.HOURS] == 1 ? "DueInHour" : "DueInHours", dueIn[ActionSDK.Utils.HOURS]));
            }
            else if (dueIn[ActionSDK.Utils.MINUTES] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn["minutes"] == 1 ? "DueInMinute" : "DueInMinutes", dueIn[ActionSDK.Utils.MINUTES]));
            } else {
                settingsStrings.push(ActionSDK.Localizer.getString("DueInMinutes", dueIn[ActionSDK.Utils.MINUTES]));
            }
        }

        if (this.props.resultVisibility) {
            if (this.props.resultVisibility == ResultVisibility.All) {
                settingsStrings.push(ActionSDK.Localizer.getString("ResultsVisibilitySettingsSummaryEveryone"));
            } else {
                settingsStrings.push(ActionSDK.Localizer.getString("ResultsVisibilitySettingsSummarySenderOnly"));
            }
        }

        if (this.props.notificationSettings) {
            if (this.props.notificationSettings.mode == NotificationSettingMode.None) {
                settingsStrings.push(ActionSDK.Localizer.getString("notifyMeNever"));
            } else if (this.props.notificationSettings.mode == NotificationSettingMode.Daily) {
                settingsStrings.push(ActionSDK.Localizer.getString("notifyMeOnceADay"));
            } else if (this.props.notificationSettings.mode == NotificationSettingMode.OnRowCreate) {
                settingsStrings.push(ActionSDK.Localizer.getString("notifyMeOnEveryUpdate"));
            }
        }
        return settingsStrings.join(", ");
    }

    render() {
        return (
            <div className="settings-footer" {...UxUtils.getTabKeyProps()} ref={(element) => {
                if (this.props.onRef) {
                    this.props.onRef(element);
                }
            }} onClick={() => {
                this.props.onClick();
            }}>
                <Icon className="settings-icon" name="settings" outline={true} color="brand" />

                <Text content={this.props.showDefaultTitle ? ActionSDK.Localizer.getString("Settings") : this.updateSettingsSummary()} size="small" color="brand" />
            </div>);
    }
}
