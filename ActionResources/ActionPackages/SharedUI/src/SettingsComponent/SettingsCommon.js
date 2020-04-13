"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This enum should be in sync with ActionCommon\src\model\Visibility
// We are not using the same enum here so as to not take a dependency on 
// the ActionSDK. We need to ensure that the enum values match exactly.
var ResultVisibility;
(function (ResultVisibility) {
    ResultVisibility["All"] = "All";
    ResultVisibility["Sender"] = "Sender";
})(ResultVisibility = exports.ResultVisibility || (exports.ResultVisibility = {}));
// This enum should be in sync with ActionCommon\src\model\NotificationSettingMode
// We are not using the same enum here so as to not take a dependency on 
// the ActionSDK. We need to ensure that the enum values match exactly.
var NotificationSettingMode;
(function (NotificationSettingMode) {
    NotificationSettingMode["None"] = "None";
    NotificationSettingMode["Daily"] = "Daily";
    NotificationSettingMode["OnRowCreate"] = "OnRowCreate";
    NotificationSettingMode["OnRowUpdate"] = "OnRowUpdate";
})(NotificationSettingMode = exports.NotificationSettingMode || (exports.NotificationSettingMode = {}));
var NotificationSettings = /** @class */ (function () {
    function NotificationSettings(mode, time) {
        this.mode = mode;
        this.time = time;
    }
    return NotificationSettings;
}());
exports.NotificationSettings = NotificationSettings;
var SettingsSections;
(function (SettingsSections) {
    SettingsSections[SettingsSections["DUE_BY"] = 0] = "DUE_BY";
    SettingsSections[SettingsSections["RESULTS_VISIBILITY"] = 1] = "RESULTS_VISIBILITY";
    SettingsSections[SettingsSections["NOTIFICATIONS"] = 2] = "NOTIFICATIONS";
    SettingsSections[SettingsSections["MULTI_RESPONSE"] = 3] = "MULTI_RESPONSE";
})(SettingsSections = exports.SettingsSections || (exports.SettingsSections = {}));
