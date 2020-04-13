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
require("./Rating.scss");
var _sharedUI_1 = require("@sharedUI");
var ActionSDK = require("@actionSDK");
var ToggleRatingView = /** @class */ (function (_super) {
    __extends(ToggleRatingView, _super);
    function ToggleRatingView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: props.defaultValue
        };
        return _this;
    }
    ToggleRatingView.getDerivedStateFromProps = function (props, state) {
        return {
            value: props.defaultValue
        };
    };
    ToggleRatingView.prototype.onChange = function (value) {
        if (!this.props.disabled) {
            this.setState({ value: value });
            this.props.onChange(value);
        }
    };
    ToggleRatingView.prototype.render = function () {
        var _this = this;
        var className = "rating-icon";
        if (this.props.disabled) {
            className = className + " disabled-rating";
        }
        else if (!this.props.isPreview) {
            className = className + " pointer-cursor";
        }
        var isAccessibilityDisabled = this.props.isPreview || this.props.disabled;
        return (React.createElement(react_1.Flex, { gap: "gap.medium" },
            React.createElement(react_1.Icon, __assign({ "aria-label": this.state.value ? ActionSDK.Localizer.getString("LikeTextSelected") : ActionSDK.Localizer.getString("LikeText") }, (!isAccessibilityDisabled) && _sharedUI_1.UxUtils.getTabKeyProps(), { name: "like", outline: this.state.value != true, size: "medium", role: "button", disabled: this.props.disabled && !this.props.isPreview, "aria-disabled": isAccessibilityDisabled, onClick: isAccessibilityDisabled ? null : function () {
                    _this.onChange(true);
                }, className: this.state.value === true ? className : '' })),
            React.createElement(react_1.Icon, __assign({ "aria-label": this.state.value === false ? ActionSDK.Localizer.getString("DislikeTextSelected") : ActionSDK.Localizer.getString("DislikeText") }, (!isAccessibilityDisabled) && _sharedUI_1.UxUtils.getTabKeyProps(), { name: "like", role: "button", outline: this.state.value != false, rotate: 180, disabled: this.props.disabled && !this.props.isPreview, "aria-disabled": isAccessibilityDisabled, size: "medium", onClick: isAccessibilityDisabled ? null : function () {
                    _this.onChange(false);
                }, className: this.state.value === false ? className : '' }))));
    };
    return ToggleRatingView;
}(React.PureComponent));
exports.ToggleRatingView = ToggleRatingView;
