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
require("./SettingsComponent.scss");
var react_1 = require("@stardust-ui/react");
var _sharedUI_1 = require("@sharedUI");
var SettingsMobile = /** @class */ (function (_super) {
    __extends(SettingsMobile, _super);
    function SettingsMobile(props) {
        return _super.call(this, props) || this;
    }
    SettingsMobile.prototype.componentDidMount = function () {
        if (this.props.onMount) {
            this.props.onMount();
        }
    };
    SettingsMobile.prototype.render = function () {
        var _this = this;
        this.settingProps = {
            notificationSettings: this.props.notificationSettings,
            dueDate: this.props.dueDate,
            resultVisibility: this.props.resultVisibility,
            locale: this.props.locale,
            isResponseAnonymous: this.props.isResponseAnonymous,
            isResponseEditable: this.props.isResponseEditable,
            isMultiResponseAllowed: this.props.hasOwnProperty("isMultiResponseAllowed") ? this.props.isMultiResponseAllowed : false,
            strings: this.props.strings
        };
        return React.createElement(_sharedUI_1.SettingsComponent, __assign({}, this.props, { renderDueBySection: function () { return _this.renderDueBySection(); }, renderResultVisibilitySection: function () { return _this.renderResultVisibilitySection(); }, renderNotificationsSection: function () { return _this.renderNotificationsSection(); }, renderResponseOptionsSection: function () { return _this.renderResponseOptionsSection(); } }));
    };
    SettingsMobile.prototype.renderDueBySection = function () {
        var _this = this;
        return (React.createElement(react_1.Flex, { column: true, className: "settings-item-margin" },
            React.createElement("label", { className: "settings-item-title" }, this.getString("dueBy")),
            React.createElement("div", { className: "due-by-pickers-container date-time-equal" },
                React.createElement(_sharedUI_1.DateTimePickerView, { showTimePicker: true, minDate: new Date(), locale: this.props.locale, value: new Date(this.props.dueDate), placeholderDate: this.getString("datePickerPlaceholder"), placeholderTime: this.getString("timePickerPlaceholder"), renderForMobile: this.props.renderForMobile, onSelect: function (date) {
                        _this.settingProps.dueDate = date.getTime();
                        _this.props.onChange(_this.settingProps);
                    } })),
            React.createElement(react_1.Divider, { className: "zero-padding" })));
    };
    SettingsMobile.prototype.renderResultVisibilitySection = function () {
        var _this = this;
        return (React.createElement(react_1.Flex, { column: true, className: "settings-item-margin" },
            React.createElement("label", { className: "settings-item-title" }, this.getString("resultsVisibleTo")),
            React.createElement(_sharedUI_1.RadioGroupMobile, { checkedValue: this.settingProps.resultVisibility, items: _sharedUI_1.SettingsUtils.getVisibilityItems(this.getString("resultsVisibleToAll"), this.getString("resultsVisibleToSender")), checkedValueChanged: function (value) {
                    _this.settingProps.resultVisibility = value;
                    _this.props.onChange(_this.settingProps);
                } }),
            React.createElement(react_1.Divider, { className: "zero-padding" })));
    };
    SettingsMobile.prototype.renderNotificationsSection = function () {
        var _this = this;
        return (React.createElement(react_1.Flex, { column: true, className: "settings-item-margin" },
            React.createElement("label", { className: "settings-item-title" }, this.getString("notifications")),
            React.createElement(_sharedUI_1.RadioGroupMobile, { checkedValue: this.props.notificationSettings.mode, items: _sharedUI_1.SettingsUtils.getNotificationItems(true, this.getString("notificationsAsResponsesAsReceived"), this.getString("notificationsEverydayAt"), this.getString("timePickerPlaceholder"), this.settingProps.notificationSettings.time, function (minutes) {
                    _this.settingProps.notificationSettings.time = minutes;
                    _this.props.onChange(_this.settingProps);
                }, this.getString("notificationsNever"), this.props.locale), checkedValueChanged: function (value) {
                    if (value == _sharedUI_1.NotificationSettingMode.Daily) {
                        _this.settingProps.notificationSettings.mode = _sharedUI_1.NotificationSettingMode.Daily;
                    }
                    else if (value == _sharedUI_1.NotificationSettingMode.None) {
                        _this.settingProps.notificationSettings.mode = _sharedUI_1.NotificationSettingMode.None;
                    }
                    else {
                        _this.settingProps.notificationSettings.mode = _sharedUI_1.NotificationSettingMode.OnRowCreate;
                    }
                    _this.props.onChange(_this.settingProps);
                } }),
            React.createElement(react_1.Divider, { className: "zero-padding" })));
    };
    SettingsMobile.prototype.renderResponseOptionsSection = function () {
        var _this = this;
        return (React.createElement(react_1.Flex, { column: true, className: "settings-item-margin" },
            React.createElement("label", { className: "settings-item-title" }, this.getString("responseOptions")),
            React.createElement(react_1.Checkbox, { checked: this.props.isMultiResponseAllowed, label: this.getString("multipleResponses"), labelPosition: "start", className: "mobile-checkbox" + (this.props.isMultiResponseAllowed ? "" : " unchecked"), onChange: function (e, props) {
                    _this.settingProps.isMultiResponseAllowed = props.checked;
                    _this.props.onChange(_this.settingProps);
                } }),
            React.createElement(react_1.Divider, { className: "zero-padding" })));
    };
    SettingsMobile.prototype.getString = function (key) {
        if (this.props.strings && this.props.strings.hasOwnProperty(key)) {
            return this.props.strings[key];
        }
        return key;
    };
    return SettingsMobile;
}(React.PureComponent));
exports.SettingsMobile = SettingsMobile;
