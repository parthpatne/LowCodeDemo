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
var react_1 = require("@stardust-ui/react");
var LoaderUI = /** @class */ (function (_super) {
    __extends(LoaderUI, _super);
    function LoaderUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoaderUI.prototype.render = function () {
        return (React.createElement(react_1.Flex, { fill: true, vAlign: "center", hAlign: "center", styles: this.props.fill ? {
                position: "absolute"
            } : null },
            React.createElement(react_1.Loader, null)));
    };
    return LoaderUI;
}(React.Component));
exports.LoaderUI = LoaderUI;
