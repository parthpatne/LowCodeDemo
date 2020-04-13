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
require("./ErrorView.scss");
var react_1 = require("@stardust-ui/react");
var ActionSDK = require("@actionSDK");
var Button_1 = require("../Button");
var images_1 = require("../images");
var ErrorView = /** @class */ (function (_super) {
    __extends(ErrorView, _super);
    function ErrorView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorView.prototype.render = function () {
        var image = this.props.image;
        if (ActionSDK.Utils.isEmptyString(this.props.image)) {
            image = images_1.genericError;
        }
        return (React.createElement(react_1.Flex, { column: true, gap: "gap.large", fill: true, className: "body-container display-flex", hAlign: "center", vAlign: "center" },
            React.createElement(react_1.Flex, { column: true, className: "error-view-container" },
                React.createElement("img", { src: image, className: "error-view-image" }),
                React.createElement(react_1.Text, { className: "error-view-title" }, this.props.title),
                !ActionSDK.Utils.isEmptyString(this.props.subtitle) && React.createElement(react_1.Text, { className: "error-view-subtitle" }, this.props.subtitle)),
            React.createElement(Button_1.ButtonComponent, { primary: true, content: this.props.buttonTitle, className: "error-view-button", onClick: function () {
                    ActionSDK.APIs.dismissScreen();
                } })));
    };
    return ErrorView;
}(React.Component));
exports.ErrorView = ErrorView;
