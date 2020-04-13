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
require("./RadioGroupMobile.scss");
var react_1 = require("@stardust-ui/react");
var RadioGroupMobile = /** @class */ (function (_super) {
    __extends(RadioGroupMobile, _super);
    function RadioGroupMobile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RadioGroupMobile.prototype.render = function () {
        return (React.createElement(React.Fragment, null, this.getRadioItemViews()));
    };
    RadioGroupMobile.prototype.getRadioItemViews = function () {
        var _this = this;
        var radioItemViews = [];
        this.props.items.forEach(function (item) {
            var radioItem = _this.getRadioItem(item);
            if (radioItem) {
                radioItemViews.push(radioItem);
            }
        });
        return radioItemViews;
    };
    RadioGroupMobile.prototype.getRadioItem = function (item) {
        var _this = this;
        var isChecked = item.value == this.props.checkedValue;
        return (React.createElement(react_1.Flex, { className: "radio-item-container", key: item.key, onClick: function () { _this.props.checkedValueChanged(item.value); } },
            React.createElement("div", { role: "radio", "aria-checked": isChecked, className: "radio-item-content " + item.className }, item.label),
            React.createElement("div", { className: "checkmark-icons-container" },
                React.createElement(react_1.Icon, { className: "checkmark-icon checkmark-bg-icon", name: "stardust-circle", color: isChecked ? "brand" : "grey", outline: !isChecked, disabled: !isChecked }),
                isChecked ? React.createElement(react_1.Icon, { className: "checkmark-icon checkmark-tick-icon", name: "stardust-checkmark", color: "white" }) : null)));
    };
    return RadioGroupMobile;
}(React.PureComponent));
exports.RadioGroupMobile = RadioGroupMobile;
