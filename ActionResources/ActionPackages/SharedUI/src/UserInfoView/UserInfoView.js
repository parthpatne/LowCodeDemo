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
var _actionCommon_1 = require("@actionCommon");
require("./UserInfoView.scss");
var UserInfoView = /** @class */ (function (_super) {
    __extends(UserInfoView, _super);
    function UserInfoView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserInfoView.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(react_1.Flex, __assign({ "aria-label": this.props.accessibilityLabel, className: "user-info-view overflow-hidden", vAlign: "center", gap: "gap.small", onClick: this.props.onClick }, _sharedUI_1.UxUtils.getListItemProps()),
                React.createElement(react_1.Avatar, { className: "user-profile-pic", name: this.props.userName, image: this.props.pictureUrl, size: "medium", "aria-hidden": "true" }),
                React.createElement(react_1.Flex, { "aria-hidden": !_actionCommon_1.Utils.isEmptyString(this.props.accessibilityLabel), column: true, className: "overflow-hidden" },
                    React.createElement(react_1.Text, { truncated: true, size: "medium" }, this.props.userName),
                    this.props.subtitle &&
                        React.createElement(react_1.Text, { truncated: true, size: "small" }, this.props.subtitle)),
                this.props.date && React.createElement(react_1.FlexItem, { push: true },
                    React.createElement(react_1.Text, { "aria-hidden": !_actionCommon_1.Utils.isEmptyString(this.props.accessibilityLabel), className: "nowrap date-grey", size: "small" }, this.props.date))),
            this.props.showBelowDivider ? React.createElement(react_1.Divider, null) : null));
    };
    return UserInfoView;
}(React.PureComponent));
exports.UserInfoView = UserInfoView;
