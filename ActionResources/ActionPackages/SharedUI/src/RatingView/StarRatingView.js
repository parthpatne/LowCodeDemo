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
var StarRatingView = /** @class */ (function (_super) {
    __extends(StarRatingView, _super);
    function StarRatingView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: props.defaultValue
        };
        return _this;
    }
    StarRatingView.getDerivedStateFromProps = function (props, state) {
        return {
            value: props.defaultValue
        };
    };
    StarRatingView.prototype.render = function () {
        var _this = this;
        var items = [];
        var _loop_1 = function (i) {
            var className = this_1.state.value < i ? 'rating-icon-unfilled' : 'rating-icon';
            className = (this_1.props.disabled && this_1.state.value >= i) ? className + " disabled-rating" : className;
            if (!this_1.props.isPreview && !this_1.props.disabled) {
                className = className + " pointer-cursor";
            }
            var isAccessibilityDisabled = this_1.props.disabled || this_1.props.isPreview;
            items.push(React.createElement(react_1.Icon, __assign({ role: "button" }, (!isAccessibilityDisabled) && _sharedUI_1.UxUtils.getTabKeyProps(), { "aria-label": i <= this_1.state.value ? ActionSDK.Localizer.getString("StarValueSelected", i) : ActionSDK.Localizer.getString("StarValue", i), key: i, name: this_1.props.icon ? this_1.props.icon : "star", outline: this_1.state.value < i, disabled: this_1.props.disabled && !this_1.props.isPreview, "aria-disabled": isAccessibilityDisabled, onClick: isAccessibilityDisabled ? null : function () {
                    ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("StarNumberSelected", i));
                    _this.setState({ value: i });
                    _this.props.onChange(i);
                }, className: className })));
        };
        var this_1 = this;
        for (var i = 1; i <= this.props.max; i++) {
            _loop_1(i);
        }
        return (React.createElement(react_1.Flex, { gap: "gap.medium" }, items));
    };
    return StarRatingView;
}(React.PureComponent));
exports.StarRatingView = StarRatingView;
