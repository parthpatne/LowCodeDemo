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
var ActionSDK = require("@actionSDK");
require("./NavBarComponent.scss");
var NavBarItemType;
(function (NavBarItemType) {
    NavBarItemType[NavBarItemType["BACK"] = 0] = "BACK";
})(NavBarItemType = exports.NavBarItemType || (exports.NavBarItemType = {}));
var NavBarComponent = /** @class */ (function (_super) {
    __extends(NavBarComponent, _super);
    function NavBarComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavBarComponent.prototype.componentWillMount = function () {
        this.registerBackButtonHandlerIfRequired(this.props.leftNavBarItem);
        this.registerBackButtonHandlerIfRequired(this.props.rightNavBarItem);
    };
    NavBarComponent.prototype.registerBackButtonHandlerIfRequired = function (navBarItem) {
        if (!navBarItem) {
            return;
        }
        if (navBarItem.type == NavBarItemType.BACK && navBarItem.onClick) {
            ActionSDK.APIs.registerBackButtonHandler(function () {
                navBarItem.onClick();
            });
            this.isBackButtonHandlerRegistered = true;
        }
    };
    NavBarComponent.prototype.componentWillUnmount = function () {
        if (this.isBackButtonHandlerRegistered) {
            ActionSDK.APIs.registerBackButtonHandler(null);
        }
    };
    NavBarComponent.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "nav-container" },
                this.getNavBarItem(this.props.leftNavBarItem),
                React.createElement("label", { className: "nav-title" }, this.props.title),
                this.getNavBarItem(this.props.rightNavBarItem)),
            React.createElement("div", { className: "nav-bar-offset-height" })));
    };
    NavBarComponent.prototype.getNavBarItem = function (navBarItem) {
        if (!navBarItem) {
            return null;
        }
        var navBarItemClassName = "nav-bar-item-default" + (navBarItem.className ? " " + navBarItem.className : "");
        return (React.createElement(react_1.Flex, { vAlign: "center", className: navBarItemClassName, role: "button", "aria-label": navBarItem.ariaLabel, onClick: function () { navBarItem.onClick(); }, tabIndex: 0 },
            navBarItem.icon ? React.createElement(react_1.Icon, __assign({}, navBarItem.icon)) : null,
            navBarItem.title ? React.createElement(react_1.Text, { className: "nav-bar-item-text", content: navBarItem.title }) : null));
    };
    return NavBarComponent;
}(React.PureComponent));
exports.NavBarComponent = NavBarComponent;
