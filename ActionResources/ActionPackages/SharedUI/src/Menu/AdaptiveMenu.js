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
require("./AdaptiveMenu.scss");
var AdaptiveMenuRenderStyle;
(function (AdaptiveMenuRenderStyle) {
    AdaptiveMenuRenderStyle[AdaptiveMenuRenderStyle["MENU"] = 0] = "MENU";
    AdaptiveMenuRenderStyle[AdaptiveMenuRenderStyle["ACTIONSHEET"] = 1] = "ACTIONSHEET";
})(AdaptiveMenuRenderStyle = exports.AdaptiveMenuRenderStyle || (exports.AdaptiveMenuRenderStyle = {}));
var AdaptiveMenu = /** @class */ (function (_super) {
    __extends(AdaptiveMenu, _super);
    function AdaptiveMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            menuOpen: false
        };
        return _this;
    }
    AdaptiveMenu.prototype.render = function () {
        switch (this.props.renderAs) {
            case AdaptiveMenuRenderStyle.ACTIONSHEET:
                return this.getActionSheet();
            case AdaptiveMenuRenderStyle.MENU:
            default:
                return this.getMenu();
        }
    };
    AdaptiveMenu.prototype.getActionSheet = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(react_1.Flex, { className: "actionsheet-trigger-bg", onClick: function () { _this.setState({ menuOpen: !_this.state.menuOpen }); } }, this.props.content),
            React.createElement(react_1.Dialog, { open: this.state.menuOpen, className: "hide-default-dialog-container", content: React.createElement(react_1.Flex, { className: "actionsheet-view-bg", onClick: function () { _this.setState({ menuOpen: !_this.state.menuOpen }); } },
                    this.getDismissButtonForActionSheet(),
                    React.createElement(react_1.Flex, { role: "menu", column: true, className: "actionsheet-view-container" }, this.getActionSheetItems())) })));
    };
    AdaptiveMenu.prototype.getActionSheetItems = function () {
        var actionSheetItems = [];
        var index = 0;
        this.props.menuItems.forEach(function (menuItem) {
            var menuItemProps = {
                menuItem: menuItem
            };
            actionSheetItems.push(React.createElement(AdaptiveMenuItemComponent, __assign({}, menuItemProps, { ref: function (ref) {
                    if (index === 0 && ref) {
                        ref.focusCurrentItem();
                    }
                    index++;
                } })));
        });
        return actionSheetItems;
    };
    AdaptiveMenu.prototype.getDismissButtonForActionSheet = function () {
        var _this = this;
        // Hidden Dismiss button for accessibility
        return (React.createElement(react_1.Flex, { className: "hidden-dismiss-button", role: "button", "aria-hidden": false, tabIndex: 0, "aria-label": this.props.dismissMenuAriaLabel, onClick: function () {
                _this.setState({ menuOpen: !_this.state.menuOpen });
            } }));
    };
    AdaptiveMenu.prototype.getMenu = function () {
        var menuItems;
        menuItems = Object.assign([], this.props.menuItems);
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].className = "menu-item " + menuItems[i].className;
        }
        return (React.createElement(react_1.Menu, { defaultActiveIndex: 0, className: (this.props.className ? this.props.className : "") + " menu-default", items: [
                {
                    key: this.props.key,
                    "aria-hidden": true,
                    content: this.props.content,
                    className: "menu-items",
                    indicator: null,
                    menu: {
                        items: menuItems
                    }
                }
            ] }));
    };
    return AdaptiveMenu;
}(React.Component));
exports.AdaptiveMenu = AdaptiveMenu;
var AdaptiveMenuItemComponent = /** @class */ (function (_super) {
    __extends(AdaptiveMenuItemComponent, _super);
    function AdaptiveMenuItemComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdaptiveMenuItemComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { role: "menuitem", tabIndex: 0, className: "actionsheet-item-container", key: this.props.menuItem.key, onClick: function () { _this.props.menuItem.onClick(); }, ref: function (ref) {
                if (ref) {
                    _this.ref = ref;
                }
            } },
            this.props.menuItem.icon &&
                React.createElement(react_1.Icon, __assign({}, this.props.menuItem.icon)),
            React.createElement(react_1.Text, { className: "actionsheet-item-label", content: this.props.menuItem.content })));
    };
    AdaptiveMenuItemComponent.prototype.focusCurrentItem = function () {
        if (this.ref) {
            this.ref.focus();
        }
    };
    return AdaptiveMenuItemComponent;
}(React.PureComponent));
