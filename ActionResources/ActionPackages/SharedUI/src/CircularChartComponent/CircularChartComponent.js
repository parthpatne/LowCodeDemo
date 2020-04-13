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
require("./CircularChartComponent.scss");
var react_1 = require("@stardust-ui/react");
var CircularChartComponent = /** @class */ (function (_super) {
    __extends(CircularChartComponent, _super);
    function CircularChartComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.canvasRef = null;
        _this.canvasRef = React.createRef();
        return _this;
    }
    CircularChartComponent.prototype.componentDidMount = function () {
        var canvasContext = this.canvasRef.current.getContext("2d");
        var data = [this.props.progress, this.props.outOf];
        var colors = ["#6264a7", "#c8c6c4"];
        var radius = (this.props.width - this.props.thickness) / 2;
        var counterClockWise = false;
        var startAngle = -(Math.PI / 2);
        for (var i = 0; i < data.length; i++) {
            canvasContext.strokeStyle = colors[i];
            canvasContext.lineWidth = this.props.thickness;
            var endAngle = startAngle + (2 * Math.PI * (data[i] / (this.props.progress + this.props.outOf)));
            canvasContext.beginPath();
            canvasContext.arc(this.props.width / 2, this.props.width / 2, radius, startAngle, endAngle, counterClockWise);
            canvasContext.stroke();
            startAngle = endAngle;
        }
    };
    CircularChartComponent.prototype.render = function () {
        return (React.createElement("div", { className: "circle-outer-div", style: {
                width: this.props.width,
                height: this.props.width
            } },
            React.createElement("canvas", { width: this.props.width, height: this.props.width, ref: this.canvasRef }),
            React.createElement(react_1.Text, { size: "small", weight: "bold", className: "circle-percentage-text", content: (this.props.progress / this.props.outOf * 100).toFixed(1) + "%" })));
    };
    return CircularChartComponent;
}(React.PureComponent));
exports.CircularChartComponent = CircularChartComponent;
