"use strict";
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
var react_1 = require("@stardust-ui/react");
var SettingsCommon_1 = require("./SettingsCommon");
var TimePickerView_1 = require("../DateTime/TimePickerView");
var SettingsUtils = /** @class */ (function () {
    function SettingsUtils() {
    }
    SettingsUtils.shouldRenderSection = function (section, excludedSections) {
        return !excludedSections || (excludedSections.indexOf(section) == -1);
    };
    SettingsUtils.getVisibilityItems = function (resultsVisibleToAllLabel, resultsVisibleToSenderLabel) {
        return [
            {
                key: "1",
                label: resultsVisibleToAllLabel,
                value: SettingsCommon_1.ResultVisibility.All,
                className: "settings-radio-item"
            },
            {
                key: "2",
                label: resultsVisibleToSenderLabel,
                value: SettingsCommon_1.ResultVisibility.Sender,
                className: "settings-radio-item-last"
            },
        ];
    };
    SettingsUtils.adjustLocalTimeinMinutesToUTC = function (timeinMinutes) {
        var date = new Date();
        date.setHours(timeinMinutes / 60);
        date.setMinutes(timeinMinutes % 60);
        var utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        return utcDate.getMinutes() + 60 * utcDate.getHours();
    };
    SettingsUtils.adjustUTCTimeinMinutesToLocal = function (timeinMinutes) {
        var date = new Date();
        date.setHours(timeinMinutes / 60);
        date.setMinutes(timeinMinutes % 60);
        var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.getMinutes() + 60 * localDate.getHours();
    };
    SettingsUtils.getNotificationItems = function (renderForMobile, notificationsAsResponsesAsReceived, notificationsEverydayAt, timePickerPlaceholder, selectedTime, onTimeChange, receiveNotification, locale) {
        var _this = this;
        var timePickerProps = {
            placeholder: timePickerPlaceholder,
            minTimeInMinutes: 0,
            defaultTimeInMinutes: this.adjustUTCTimeinMinutesToLocal(selectedTime) || 0,
            renderForMobile: renderForMobile,
            locale: locale,
            onTimeChange: function (minutes) {
                onTimeChange(_this.adjustLocalTimeinMinutesToUTC(minutes));
            }
        };
        return [
            {
                key: "1",
                label: (React.createElement(react_1.Flex, { gap: "gap.medium", wrap: true, className: "notification-time-picker" },
                    React.createElement(react_1.Text, { content: notificationsEverydayAt }),
                    React.createElement(TimePickerView_1.TimePickerView, __assign({}, timePickerProps)))),
                className: "settings-radio-item-timepicker",
                value: SettingsCommon_1.NotificationSettingMode.Daily
            },
            {
                key: "2",
                label: notificationsAsResponsesAsReceived,
                className: "settings-radio-item",
                value: SettingsCommon_1.NotificationSettingMode.OnRowCreate
            },
            {
                key: "3",
                label: receiveNotification,
                className: "settings-radio-item-last",
                value: SettingsCommon_1.NotificationSettingMode.None
            }
        ];
    };
    return SettingsUtils;
}());
exports.SettingsUtils = SettingsUtils;
