import * as React from "react";
import "./ImageCropper.scss";
import { ImagePicker } from "./ImagePicker";
import { ButtonComponent } from "../Button";

const DEFAULT_MAX_ZOOM: number = 2;
const DEFAULT_SHADED_AREA_HEIGHT_FRACTION: number = 0.33;
const ZOOM_STEPS: number = 5; // discrete steps to reach from minzoom to maxzoom

interface ICropperStrings {
    sliderLabel?: string;
    zoominBtnLabel?: string;
    zoomoutBtnLabel?: string;
}

interface CropperProps {
    url: string;
    height: number;
    width: number;
    maxZoom?: number;
    shadedDivWidthFraction?: number;
    cropperStrings?: ICropperStrings;
}

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface CropperState {
    url: string;
    imageRect: Rect;
    zoom: number;
    isInEditMode: boolean;
}

export class ImageCropper extends React.Component<CropperProps, CropperState> {
    private imgRef: HTMLImageElement | null;

    private isImageBeingMoved: boolean;
    private lastMouseDownPos: { x: number; y: number };
    private initialDimens: Rect;

    private shadedAreaHeight: number;
    private minZoom: number;
    private maxZoom: number;

    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            imageRect: {
                top: 0,
                left: 0,
                width: this.props.width,
                height: this.props.height
            },
            zoom: 1,
            isInEditMode: false
        };

        this.imgRef = null;
        this.isImageBeingMoved = false;
        this.minZoom = 1;
        this.maxZoom = this.props.maxZoom ? this.props.maxZoom : DEFAULT_MAX_ZOOM;
        this.initialDimens = this.state.imageRect;
        this.shadedAreaHeight =
            (this.props.shadedDivWidthFraction !== undefined
                ? this.props.shadedDivWidthFraction
                : DEFAULT_SHADED_AREA_HEIGHT_FRACTION) * this.props.height;
    }

    render() {
        const sharedAreaHeight: number = this.shadedAreaHeight;
        return (
            <div
                className="img-parent-div"
                style={{ height: this.props.height, width: this.props.width }}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    className="img-shaded-div-top"
                    style={{ height: sharedAreaHeight }}
                ></div>
                {this.state.url && <img
                    className="img-element"
                    ref={e => {
                        this.imgRef = e;
                    }}
                    src={this.state.url}
                    style={{
                        left: this.state.imageRect.left,
                        top: this.state.imageRect.top,
                        width: this.state.imageRect.width,
                        height: this.state.imageRect.height
                    }}
                    onLoad={e => this.onImageLoad(e.target as HTMLImageElement)}
                />}
                {!this.state.url &&
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}></div>}
                <div
                    className="img-shaded-div-bottom"
                    style={{ height: sharedAreaHeight }}
                ></div>
                <div className="crop-controls">
                    {this.state.isInEditMode && <ImagePicker
                        onFileSelected={image => {
                            this.setState({ ...this.state, url: image.url, zoom: this.minZoom });
                        }}
                        trigger={<ButtonComponent primary styles={{ width: '100%' }} content={'Upload'} onClick={this.onZoomIn} />}
                    />}
                    {this.state.isInEditMode && <ButtonComponent primary content={'+'} onClick={this.onZoomIn} />}
                    {this.state.isInEditMode && <ButtonComponent primary content={'-'} onClick={this.onZoomOut} />}
                    {this.state.isInEditMode && <ButtonComponent primary content={'Rem'} onClick={this.onImageRemoved} />}
                    {!this.state.isInEditMode && <ButtonComponent primary content={'Edit'} onClick={this.onEditTapped} />}
                    {this.state.isInEditMode && <ButtonComponent primary content={'Done'} onClick={this.onDoneTapped} />}
                </div>
            </div>
        );
    }

    private onImageLoad = (ele: HTMLImageElement) => {
        if (ele != null) {
            const aspect: number =
                ele.naturalWidth / ele.naturalHeight;

            const width: number = ele.width;
            const height: number = width / aspect;
            const left: number = 0;

            // center align it vertically
            const top: number = - (height - this.props.height) / 2;

            this.initialDimens = { top, left, width, height };
            this.setState({ imageRect: this.initialDimens });
        } else {
            // image load failed
        }
    };

    private onMouseDown = (e: React.MouseEvent) => {
        this.isImageBeingMoved = true;
        this.lastMouseDownPos = { x: e.pageX, y: e.pageY };
    };

    private onMouseUp = (e: React.MouseEvent) => {
        this.isImageBeingMoved = false;
    };

    private onMouseLeave = (e: React.MouseEvent) => {
        this.isImageBeingMoved = false;
    };

    private onMouseMove = (e: React.MouseEvent) => {
        if (this.state.isInEditMode && this.isImageBeingMoved) {
            const currRect: Rect = this.state.imageRect;
            const newRect: Rect = {
                left: currRect.left + e.pageX - this.lastMouseDownPos.x,
                top: currRect.top + e.pageY - this.lastMouseDownPos.y,
                width: currRect.width,
                height: currRect.height
            };

            this.ensureRectInRange(newRect);

            this.lastMouseDownPos = { x: e.pageX, y: e.pageY };

            this.setState({
                ...this.state,
                imageRect: newRect
            });
        }
    };

    private setZoom = (factor: number) => {
        if (factor < this.minZoom || factor > this.maxZoom) {
            return;
        }

        const currRect: Rect = this.state.imageRect;

        const newWidth: number = this.initialDimens.width * factor;
        const newHeight: number = this.initialDimens.height * factor;

        // minimise image's center point's movement
        const centerLeft: number = currRect.width / 2 + currRect.left;
        const centerTop: number = currRect.height / 2 + currRect.top;

        const newLeft: number = centerLeft - newWidth / 2;
        const newTop: number = centerTop - newHeight / 2;

        const newRect: Rect = {
            left: newLeft,
            top: newTop,
            width: newWidth,
            height: newHeight
        };

        this.ensureRectInRange(newRect);

        this.setState({
            ...this.state,
            imageRect: newRect,
            zoom: factor
        });
    };

    private ensureRectInRange = (currRect: Rect) => {
        // width should be within min/max zoom
        if (currRect.width < this.minZoom * this.initialDimens.width) {
            currRect.width = this.initialDimens.width * this.minZoom;
        } else if (currRect.width > this.maxZoom * this.initialDimens.width) {
            currRect.width = this.initialDimens.width * this.maxZoom;
        }

        // height should be within min/max zoom
        if (currRect.height < this.minZoom * this.initialDimens.height) {
            currRect.height = this.initialDimens.height * this.minZoom;
        } else if (currRect.height > this.maxZoom * this.initialDimens.height) {
            currRect.height = this.initialDimens.height * this.maxZoom;
        }

        // adjust top so that offset area never overlaps with crop window
        if (currRect.top > this.shadedAreaHeight) {
            currRect.top = this.shadedAreaHeight;
        } else if (
            currRect.top <
            this.props.height - currRect.height - this.shadedAreaHeight
        ) {
            currRect.top =
                this.props.height - currRect.height - this.shadedAreaHeight;
        }

        // adjust left so that offset area never overlaps with crop window
        if (currRect.left > 0) {
            currRect.left = 0;
        } else if (currRect.left < this.props.width - currRect.width) {
            currRect.left = this.props.width - currRect.width;
        }
    };

    private onZoomIn = () => {
        if (this.state.isInEditMode && this.state.url.length > 0) {
            const zoomFactorDiff = (this.maxZoom - this.minZoom) / ZOOM_STEPS;
            this.setZoom(this.state.zoom + zoomFactorDiff);
        }
    }

    private onZoomOut = () => {
        if (this.state.isInEditMode && this.state.url.length > 0) {
            const zoomFactorDiff = (this.maxZoom - this.minZoom) / ZOOM_STEPS;
            this.setZoom(this.state.zoom - zoomFactorDiff);
        }
    }

    private onEditTapped = () => {
        this.setState({ isInEditMode: true });
    }

    private onDoneTapped = () => {
        this.setState({ isInEditMode: false });
    }

    public async cropCurrentImageAsync(): Promise<string> {
        const image: HTMLImageElement = this.imgRef;

        const scaleX: number = image.naturalWidth / image.width;
        const scaleY: number = image.naturalHeight / image.height;
        const height: number = this.props.height - 2 * this.shadedAreaHeight;
        const width: number = this.props.width;

        const left: number = -image.offsetLeft;
        const top: number = -image.offsetTop + this.shadedAreaHeight;
        const cropWidth: number = scaleX * this.props.width;
        const cropHeight: number = scaleY * height;

        return this.cropImageAsync(
            image,
            {
                top: top * scaleY,
                left: left * scaleX,
                width: cropWidth,
                height: cropHeight
            },
            width,
            height
        );
    }

    private cropImageAsync = (
        image: CanvasImageSource,
        dimen: Rect,
        canvasWidth: number,
        canvasHeight: number
    ): Promise<string> => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d", { alpha: false });
        try {
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    image,
                    dimen.left,
                    dimen.top,
                    dimen.width,
                    dimen.height,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }
        } catch (e) {
            return Promise.reject("Error while croping:" + e);
        }
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(window.URL.createObjectURL(blob));
            }, "image/jpeg");
        });
    };

    private onImageRemoved = () => {
        this.setState({ url: '', isInEditMode: false });
    };
}
