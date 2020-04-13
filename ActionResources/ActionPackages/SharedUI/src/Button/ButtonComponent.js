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
var ReactDOM = require("react-dom");
var react_1 = require("@stardust-ui/react");
var ButtonComponent = /** @class */ (function (_super) {
    __extends(ButtonComponent, _super);
    function ButtonComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.button = null;
        return _this;
    }
    ButtonComponent.prototype.render = function () {
        if (!this.button) {
            this.button = ReactDOM.findDOMNode(this);
        }
        if (this.button) {
            if (this.props.showLoader) {
                this.button.style.width = this.button.clientWidth + "px";
            }
            else {
                this.button.style.width = "";
            }
        }
        return (React.createElement(react_1.Button, __assign({}, this.props, { disabled: this.props.showLoader || this.props.disabled }), this.props.showLoader ? React.createElement(react_1.Loader, { size: "small" }) : null));
    };
    return ButtonComponent;
}(React.Component));
exports.ButtonComponent = ButtonComponent;
