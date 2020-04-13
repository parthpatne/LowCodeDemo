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
require("./BarChartComponent.scss");
var react_1 = require("@stardust-ui/react");
var BarChartComponent = /** @class */ (function (_super) {
    __extends(BarChartComponent, _super);
    function BarChartComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarChartComponent.prototype.render = function () {
        var items = [];
        for (var i = 0; i < this.props.items.length; i++) {
            var item = this.props.items[i];
            var optionCount = item.quantity;
            var percentage = Math.round(this.props.totalQuantity != 0 ? (optionCount / this.props.totalQuantity * 100) : 0);
            var percentageString = this.props.getBarPercentageString ? this.props.getBarPercentageString(percentage) : percentage + "%";
            items.push(React.createElement("div", { role: "listitem", "aria-label": this.props.items[i].accessibilityLabel, className: "option-container" },
                React.createElement(react_1.Flex, { gap: "gap.small", vAlign: "center" },
                    React.createElement(react_1.Text, { "aria-hidden": true, content: item.title, size: "medium", className: item.titleClassName, truncated: true }),
                    !item.hideStatistics &&
                        React.createElement(React.Fragment, null,
                            React.createElement(react_1.FlexItem, { push: true },
                                React.createElement(react_1.Text, { "aria-hidden": true, content: optionCount, size: "small", weight: "bold" })),
                            React.createElement(react_1.Text, { "aria-hidden": true, "aria-label": percentageString, content: '(' + percentageString + ')', size: "small" }))),
                React.createElement("div", { className: "option-bar" },
                    React.createElement("div", { className: item.className + " option-percent", style: { width: (optionCount / this.props.totalQuantity * 100) + "%" } }))));
        }
        return (React.createElement(react_1.Flex, { role: "list", "aria-label": this.props.accessibilityLabel, column: true, gap: "gap.small" }, items));
    };
    return BarChartComponent;
}(React.PureComponent));
exports.BarChartComponent = BarChartComponent;
