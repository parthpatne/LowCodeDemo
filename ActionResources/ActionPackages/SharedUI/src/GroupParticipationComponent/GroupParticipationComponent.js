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
require("./GroupParticipationComponent.scss");
var CircularChartComponent_1 = require("../CircularChartComponent");
var react_1 = require("@stardust-ui/react");
var GroupParticipationComponent = /** @class */ (function (_super) {
    __extends(GroupParticipationComponent, _super);
    function GroupParticipationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupParticipationComponent.prototype.render = function () {
        return (React.createElement(react_1.Flex, { column: true, gap: "gap.small" },
            React.createElement(react_1.Text, null, "Group Participation"),
            React.createElement(react_1.Flex, { gap: "gap.small", space: "between", vAlign: "center" },
                React.createElement(CircularChartComponent_1.CircularChartComponent, { progress: this.props.participationCount, outOf: this.props.groupSize, thickness: 8, width: 72 }),
                React.createElement(react_1.Flex, { column: true },
                    React.createElement(react_1.Text, { weight: "bold" },
                        this.props.groupSize,
                        " Participants"),
                    React.createElement(react_1.Text, null,
                        this.props.participationCount,
                        " Responded")))));
    };
    return GroupParticipationComponent;
}(React.PureComponent));
exports.GroupParticipationComponent = GroupParticipationComponent;
