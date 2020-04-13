import * as React from "react";
import "./CircularChartComponent.scss";
import { Text } from "@stardust-ui/react";

export interface ICircularChartProps {
    width: number;
    progress: number;
    outOf: number;
    thickness?: number;
}

export class CircularChartComponent extends React.PureComponent<ICircularChartProps> {

    private canvasRef = null;
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        let canvasContext: CanvasRenderingContext2D = (this.canvasRef.current as HTMLCanvasElement).getContext("2d");

        let data: number[] = [this.props.progress, this.props.outOf];
        let colors: string[] = ["#6264a7", "#c8c6c4"];

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
    }

    render() {
        return (
            <div className="circle-outer-div" style={{
                width: this.props.width,
                height: this.props.width
            }}>
                <canvas width={this.props.width} height={this.props.width} ref={this.canvasRef} />
                <Text 
                size="small"
                weight="bold"
                className="circle-percentage-text" 
                content={(this.props.progress / this.props.outOf * 100).toFixed(1) + "%"} />
            </div >
        );
    }
}