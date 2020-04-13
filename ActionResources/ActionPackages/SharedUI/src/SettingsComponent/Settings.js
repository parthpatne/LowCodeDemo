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
var react_1 = require("@stardust-ui/react");
var _sharedUI_1 = require("@sharedUI");
var ActionSDK = require("@actionSDK");
var Settings = /** @class */ (function (_super) {
    __extends(Settings, _super);
    function Settings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Settings.prototype.render = function () {
        return (React.createElement(react_1.Flex, { className: "body-container", column: true, gap: "gap.medium" },
            React.createElement(_sharedUI_1.SettingsComponent, __assign({}, this.props)),
            this.getBackElement()));
    };
    Settings.prototype.getBackElement = function () {
        var _this = this;
        if (!this.props.renderForMobile) {
            return (React.createElement(react_1.Flex, { className: "footer-layout", gap: "gap.smaller" },
                React.createElement(react_1.Flex, __assign({ vAlign: "center", className: "pointer-cursor" }, _sharedUI_1.UxUtils.getTabKeyProps(), { onClick: function () {
                        _this.props.onBack();
                    } }),
                    React.createElement(react_1.Icon, { name: "chevron-down", rotate: 90, xSpacing: "after", size: "small" }),
                    React.createElement(react_1.Text, { content: ActionSDK.Localizer.getString("Back") }))));
        }
    };
    return Settings;
}(React.PureComponent));
exports.Settings = Settings;
