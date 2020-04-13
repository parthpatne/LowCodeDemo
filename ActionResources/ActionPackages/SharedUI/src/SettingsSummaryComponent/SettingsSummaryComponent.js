"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var common_1 = require("../common");
var ActionSDK = require("@actionSDK");
var react_1 = require("@stardust-ui/react");
var SettingsComponent_1 = require("../SettingsComponent");
require("./SettingsSummaryComponent.scss");
var SettingsSummaryComponent = /** @class */ (function (_super) {
    __extends(SettingsSummaryComponent, _super);
    function SettingsSummaryComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isFocused = false;
        return _this;
    }
    SettingsSummaryComponent.prototype.updateSettingsSummary = function () {
        var settingsStrings = [];
        if (this.props.dueDate) {
            var dueIn = ActionSDK.Utils.getTimeRemaining(this.props.dueDate);
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
                }
                else if (dueIn[ActionSDK.Utils.HOURS] == 1) {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHourAndMinutes", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                }
                else if (dueIn[ActionSDK.Utils.MINUTES] == 1) {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHoursAndMinute", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                }
                else {
                    settingsStrings.push(ActionSDK.Localizer.getString("DueInHoursAndMinutes", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]));
                }
            }
            else if (dueIn[ActionSDK.Utils.HOURS] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.HOURS] == 1 ? "DueInHour" : "DueInHours", dueIn[ActionSDK.Utils.HOURS]));
            }
            else if (dueIn[ActionSDK.Utils.MINUTES] > 0) {
                settingsStrings.push(ActionSDK.Localizer.getString(dueIn["minutes"] == 1 ? "DueInMinute" : "DueInMinutes", dueIn[ActionSDK.Utils.MINUTES]));
            }
            else {
                settingsStrings.push(ActionSDK.Localizer.getString("DueInMinutes", dueIn[ActionSDK.Utils.MINUTES]));
            }
        }
        if (this.props.resultVisibility) {
            if (this.props.resultVisibility == SettingsComponent_1.ResultVisibility.All) {
                settingsStrings.push(ActionSDK.Localizer.getString("ResultsVisibilitySettingsSummaryEveryone"));
            }
            else {
                settingsStrings.push(ActionSDK.Localizer.getString("ResultsVisibilitySettingsSummarySenderOnly"));
            }
        }
        if (this.props.notificationSettings) {
            if (this.props.notificationSettings.mode == SettingsComponent_1.NotificationSettingMode.None) {
                settingsStrings.push(ActionSDK.Localizer.getString("notifyMeNever"));
            }
            else if (this.props.notificationSettings.mode == SettingsComponent_1.NotificationSettingMode.Daily) {
                settingsStrings.push(ActionSDK.Localizer.getString("notifyMeOnceADay"));
            }
            else if (this.props.notificationSettings.mode == SettingsComponent_1.NotificationSettingMode.OnRowCreate) {
                settingsStrings.push(ActionSDK.Localizer.getString("notifyMeOnEveryUpdate"));
            }
        }
        return settingsStrings.join(", ");
    };
    SettingsSummaryComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", __assign({ className: "settings-footer" }, common_1.UxUtils.getTabKeyProps(), { ref: function (element) {
                if (_this.props.onRef) {
                    _this.props.onRef(element);
                }
            }, onClick: function () {
                _this.props.onClick();
            } }),
            React.createElement(react_1.Icon, { className: "settings-icon", name: "settings", outline: true, color: "brand" }),
            React.createElement(react_1.Text, { content: this.props.showDefaultTitle ? ActionSDK.Localizer.getString("Settings") : this.updateSettingsSummary(), size: "small", color: "brand" })));
    };
    return SettingsSummaryComponent;
}(React.Component));
exports.SettingsSummaryComponent = SettingsSummaryComponent;
