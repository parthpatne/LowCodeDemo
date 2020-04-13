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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./SettingsComponent.scss");
var react_1 = require("@stardust-ui/react");
var _sharedUI_1 = require("@sharedUI");
var SettingsCommon_1 = require("./SettingsCommon");
var SettingsComponent = /** @class */ (function (_super) {
    __extends(SettingsComponent, _super);
    function SettingsComponent(props) {
        return _super.call(this, props) || this;
    }
    SettingsComponent.prototype.componentDidMount = function () {
        if (this.props.onMount) {
            this.props.onMount();
        }
    };
    SettingsComponent.prototype.render = function () {
        this.settingProps = {
            notificationSettings: this.props.notificationSettings,
            dueDate: this.props.dueDate,
            locale: this.props.locale,
            resultVisibility: this.props.resultVisibility,
            isResponseAnonymous: this.props.isResponseAnonymous,
            isResponseEditable: this.props.isResponseEditable,
            isMultiResponseAllowed: this.props.hasOwnProperty("isMultiResponseAllowed") ? this.props.isMultiResponseAllowed : false,
            strings: this.props.strings
        };
        return (React.createElement(react_1.Flex, { column: true },
            _sharedUI_1.SettingsUtils.shouldRenderSection(_sharedUI_1.SettingsSections.DUE_BY, this.props.excludeSections) ? this.renderDueBySection() : null,
            _sharedUI_1.SettingsUtils.shouldRenderSection(_sharedUI_1.SettingsSections.RESULTS_VISIBILITY, this.props.excludeSections) ? this.renderResultVisibilitySection() : null,
            _sharedUI_1.SettingsUtils.shouldRenderSection(_sharedUI_1.SettingsSections.NOTIFICATIONS, this.props.excludeSections) ? this.renderNotificationsSection() : null,
            _sharedUI_1.SettingsUtils.shouldRenderSection(_sharedUI_1.SettingsSections.MULTI_RESPONSE, this.props.excludeSections) ? this.renderResponseOptionsSection() : null));
    };
    SettingsComponent.prototype.renderDueBySection = function () {
        var _this = this;
        if (this.props.renderDueBySection) {
            return this.props.renderDueBySection();
        }
        else {
            return (React.createElement(react_1.Flex, { className: "settings-item-margin", role: "group", "aria-label": this.getString("dueBy"), column: true, gap: "gap.smaller" },
                React.createElement("label", { className: "settings-item-title" }, this.getString("dueBy")),
                React.createElement("div", { className: "settings-indentation" },
                    React.createElement(_sharedUI_1.DateTimePickerView, { showTimePicker: true, minDate: new Date(), locale: this.props.locale, value: new Date(this.props.dueDate), placeholderDate: this.getString("datePickerPlaceholder"), placeholderTime: this.getString("timePickerPlaceholder"), renderForMobile: this.props.renderForMobile, onSelect: function (date) {
                            _this.settingProps.dueDate = date.getTime();
                            _this.props.onChange(_this.settingProps);
                        } }))));
        }
    };
    SettingsComponent.prototype.renderResultVisibilitySection = function () {
        var _this = this;
        if (this.props.renderResultVisibilitySection) {
            return this.props.renderResultVisibilitySection();
        }
        else {
            return (React.createElement(react_1.Flex, { className: "settings-item-margin", role: "group", "aria-label": this.getString("resultsVisibleTo"), column: true, gap: "gap.smaller" },
                React.createElement("label", { className: "settings-item-title" }, this.getString("resultsVisibleTo")),
                React.createElement("div", { className: "settings-indentation" },
                    React.createElement(react_1.RadioGroup, { vertical: true, checkedValue: this.settingProps.resultVisibility, items: _sharedUI_1.SettingsUtils.getVisibilityItems(this.getString("resultsVisibleToAll"), this.getString("resultsVisibleToSender")), checkedValueChanged: function (e, props) {
                            _this.settingProps.resultVisibility = props.value;
                            _this.props.onChange(_this.settingProps);
                        } }))));
        }
    };
    SettingsComponent.prototype.renderNotificationsSection = function () {
        var _this = this;
        if (this.props.renderNotificationsSection) {
            return this.props.renderNotificationsSection();
        }
        else {
            return (React.createElement(react_1.Flex, { className: "settings-item-margin", role: "group", "aria-label": this.getString("notifications"), column: true, gap: "gap.smaller" },
                React.createElement("label", { className: "settings-item-title" }, this.getString("notifications")),
                React.createElement(react_1.RadioGroup, { className: "settings-indentation", vertical: true, defaultCheckedValue: this.props.notificationSettings.mode, items: _sharedUI_1.SettingsUtils.getNotificationItems(false, this.getString("notificationsAsResponsesAsReceived"), this.getString("notificationsEverydayAt"), this.getString("timePickerPlaceholder"), this.settingProps.notificationSettings.time, function (minutes) {
                        _this.settingProps.notificationSettings.time = minutes;
                        _this.props.onChange(_this.settingProps);
                    }, this.getString("notificationsNever"), this.props.locale), checkedValueChanged: function (e, props) {
                        if (props.value == SettingsCommon_1.NotificationSettingMode.Daily) {
                            _this.settingProps.notificationSettings.mode = SettingsCommon_1.NotificationSettingMode.Daily;
                        }
                        else if (props.value == SettingsCommon_1.NotificationSettingMode.None) {
                            _this.settingProps.notificationSettings.mode = SettingsCommon_1.NotificationSettingMode.None;
                        }
                        else {
                            _this.settingProps.notificationSettings.mode = SettingsCommon_1.NotificationSettingMode.OnRowCreate;
                        }
                        _this.props.onChange(_this.settingProps);
                    } })));
        }
    };
    SettingsComponent.prototype.renderResponseOptionsSection = function () {
        var _this = this;
        if (this.props.renderResponseOptionsSection) {
            return this.props.renderResponseOptionsSection();
        }
        else {
            return (React.createElement(react_1.Flex, { className: "settings-item-margin", role: "group", "aria-label": this.getString("responseOptions"), column: true, gap: "gap.small" },
                React.createElement("label", { className: "settings-item-title" }, this.getString("responseOptions")),
                React.createElement(react_1.Checkbox, { role: "checkbox", className: "settings-indentation", checked: this.props.isMultiResponseAllowed, label: this.getString("multipleResponses"), onChange: function (e, props) {
                        _this.settingProps.isMultiResponseAllowed = props.checked;
                        _this.props.onChange(_this.settingProps);
                    } })));
        }
    };
    SettingsComponent.prototype.getString = function (key) {
        if (this.props.strings && this.props.strings.hasOwnProperty(key)) {
            return this.props.strings[key];
        }
        return key;
    };
    return SettingsComponent;
}(React.PureComponent));
exports.SettingsComponent = SettingsComponent;
