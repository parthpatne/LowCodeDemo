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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./ImageCropper.scss");
var ImagePicker_1 = require("./ImagePicker");
var Button_1 = require("../Button");
var DEFAULT_MAX_ZOOM = 2;
var DEFAULT_SHADED_AREA_HEIGHT_FRACTION = 0.33;
var ZOOM_STEPS = 5; // discrete steps to reach from minzoom to maxzoom
var ImageCropper = /** @class */ (function (_super) {
    __extends(ImageCropper, _super);
    function ImageCropper(props) {
        var _this = _super.call(this, props) || this;
        _this.onImageLoad = function (ele) {
            if (ele != null) {
                var aspect = ele.naturalWidth / ele.naturalHeight;
                var width = ele.width;
                var height = width / aspect;
                var left = 0;
                // center align it vertically
                var top_1 = -(height - _this.props.height) / 2;
                _this.initialDimens = { top: top_1, left: left, width: width, height: height };
                _this.setState({ imageRect: _this.initialDimens });
            }
            else {
                // image load failed
            }
        };
        _this.onMouseDown = function (e) {
            _this.isImageBeingMoved = true;
            _this.lastMouseDownPos = { x: e.pageX, y: e.pageY };
        };
        _this.onMouseUp = function (e) {
            _this.isImageBeingMoved = false;
        };
        _this.onMouseLeave = function (e) {
            _this.isImageBeingMoved = false;
        };
        _this.onMouseMove = function (e) {
            if (_this.state.isInEditMode && _this.isImageBeingMoved) {
                var currRect = _this.state.imageRect;
                var newRect = {
                    left: currRect.left + e.pageX - _this.lastMouseDownPos.x,
                    top: currRect.top + e.pageY - _this.lastMouseDownPos.y,
                    width: currRect.width,
                    height: currRect.height
                };
                _this.ensureRectInRange(newRect);
                _this.lastMouseDownPos = { x: e.pageX, y: e.pageY };
                _this.setState(__assign(__assign({}, _this.state), { imageRect: newRect }));
            }
        };
        _this.setZoom = function (factor) {
            if (factor < _this.minZoom || factor > _this.maxZoom) {
                return;
            }
            var currRect = _this.state.imageRect;
            var newWidth = _this.initialDimens.width * factor;
            var newHeight = _this.initialDimens.height * factor;
            // minimise image's center point's movement
            var centerLeft = currRect.width / 2 + currRect.left;
            var centerTop = currRect.height / 2 + currRect.top;
            var newLeft = centerLeft - newWidth / 2;
            var newTop = centerTop - newHeight / 2;
            var newRect = {
                left: newLeft,
                top: newTop,
                width: newWidth,
                height: newHeight
            };
            _this.ensureRectInRange(newRect);
            _this.setState(__assign(__assign({}, _this.state), { imageRect: newRect, zoom: factor }));
        };
        _this.ensureRectInRange = function (currRect) {
            // width should be within min/max zoom
            if (currRect.width < _this.minZoom * _this.initialDimens.width) {
                currRect.width = _this.initialDimens.width * _this.minZoom;
            }
            else if (currRect.width > _this.maxZoom * _this.initialDimens.width) {
                currRect.width = _this.initialDimens.width * _this.maxZoom;
            }
            // height should be within min/max zoom
            if (currRect.height < _this.minZoom * _this.initialDimens.height) {
                currRect.height = _this.initialDimens.height * _this.minZoom;
            }
            else if (currRect.height > _this.maxZoom * _this.initialDimens.height) {
                currRect.height = _this.initialDimens.height * _this.maxZoom;
            }
            // adjust top so that offset area never overlaps with crop window
            if (currRect.top > _this.shadedAreaHeight) {
                currRect.top = _this.shadedAreaHeight;
            }
            else if (currRect.top <
                _this.props.height - currRect.height - _this.shadedAreaHeight) {
                currRect.top =
                    _this.props.height - currRect.height - _this.shadedAreaHeight;
            }
            // adjust left so that offset area never overlaps with crop window
            if (currRect.left > 0) {
                currRect.left = 0;
            }
            else if (currRect.left < _this.props.width - currRect.width) {
                currRect.left = _this.props.width - currRect.width;
            }
        };
        _this.onZoomIn = function () {
            if (_this.state.isInEditMode && _this.state.url.length > 0) {
                var zoomFactorDiff = (_this.maxZoom - _this.minZoom) / ZOOM_STEPS;
                _this.setZoom(_this.state.zoom + zoomFactorDiff);
            }
        };
        _this.onZoomOut = function () {
            if (_this.state.isInEditMode && _this.state.url.length > 0) {
                var zoomFactorDiff = (_this.maxZoom - _this.minZoom) / ZOOM_STEPS;
                _this.setZoom(_this.state.zoom - zoomFactorDiff);
            }
        };
        _this.onEditTapped = function () {
            _this.setState({ isInEditMode: true });
        };
        _this.onDoneTapped = function () {
            _this.setState({ isInEditMode: false });
        };
        _this.cropImageAsync = function (image, dimen, canvasWidth, canvasHeight) {
            var canvas = document.createElement("canvas");
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            var ctx = canvas.getContext("2d", { alpha: false });
            try {
                if (ctx) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, dimen.left, dimen.top, dimen.width, dimen.height, 0, 0, canvas.width, canvas.height);
                }
            }
            catch (e) {
                return Promise.reject("Error while croping:" + e);
            }
            return new Promise(function (resolve, reject) {
                canvas.toBlob(function (blob) {
                    if (!blob) {
                        reject(new Error("Canvas is empty"));
                        return;
                    }
                    resolve(window.URL.createObjectURL(blob));
                }, "image/jpeg");
            });
        };
        _this.onImageRemoved = function () {
            _this.setState({ url: '', isInEditMode: false });
        };
        _this.state = {
            url: _this.props.url,
            imageRect: {
                top: 0,
                left: 0,
                width: _this.props.width,
                height: _this.props.height
            },
            zoom: 1,
            isInEditMode: false
        };
        _this.imgRef = null;
        _this.isImageBeingMoved = false;
        _this.minZoom = 1;
        _this.maxZoom = _this.props.maxZoom ? _this.props.maxZoom : DEFAULT_MAX_ZOOM;
        _this.initialDimens = _this.state.imageRect;
        _this.shadedAreaHeight =
            (_this.props.shadedDivWidthFraction !== undefined
                ? _this.props.shadedDivWidthFraction
                : DEFAULT_SHADED_AREA_HEIGHT_FRACTION) * _this.props.height;
        return _this;
    }
    ImageCropper.prototype.render = function () {
        var _this = this;
        var sharedAreaHeight = this.shadedAreaHeight;
        return (React.createElement("div", { className: "img-parent-div", style: { height: this.props.height, width: this.props.width }, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove, onMouseLeave: this.onMouseLeave },
            React.createElement("div", { className: "img-shaded-div-top", style: { height: sharedAreaHeight } }),
            this.state.url && React.createElement("img", { className: "img-element", ref: function (e) {
                    _this.imgRef = e;
                }, src: this.state.url, style: {
                    left: this.state.imageRect.left,
                    top: this.state.imageRect.top,
                    width: this.state.imageRect.width,
                    height: this.state.imageRect.height
                }, onLoad: function (e) { return _this.onImageLoad(e.target); } }),
            !this.state.url &&
                React.createElement("div", { style: { width: '100%', height: '100%', backgroundColor: 'lightgray' } }),
            React.createElement("div", { className: "img-shaded-div-bottom", style: { height: sharedAreaHeight } }),
            React.createElement("div", { className: "crop-controls" },
                this.state.isInEditMode && React.createElement(ImagePicker_1.ImagePicker, { onFileSelected: function (image) {
                        _this.setState(__assign(__assign({}, _this.state), { url: image.url, zoom: _this.minZoom }));
                    }, trigger: React.createElement(Button_1.ButtonComponent, { primary: true, styles: { width: '100%' }, content: 'Upload', onClick: this.onZoomIn }) }),
                this.state.isInEditMode && React.createElement(Button_1.ButtonComponent, { primary: true, content: '+', onClick: this.onZoomIn }),
                this.state.isInEditMode && React.createElement(Button_1.ButtonComponent, { primary: true, content: '-', onClick: this.onZoomOut }),
                this.state.isInEditMode && React.createElement(Button_1.ButtonComponent, { primary: true, content: 'Rem', onClick: this.onImageRemoved }),
                !this.state.isInEditMode && React.createElement(Button_1.ButtonComponent, { primary: true, content: 'Edit', onClick: this.onEditTapped }),
                this.state.isInEditMode && React.createElement(Button_1.ButtonComponent, { primary: true, content: 'Done', onClick: this.onDoneTapped }))));
    };
    ImageCropper.prototype.cropCurrentImageAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var image, scaleX, scaleY, height, width, left, top, cropWidth, cropHeight;
            return __generator(this, function (_a) {
                image = this.imgRef;
                scaleX = image.naturalWidth / image.width;
                scaleY = image.naturalHeight / image.height;
                height = this.props.height - 2 * this.shadedAreaHeight;
                width = this.props.width;
                left = -image.offsetLeft;
                top = -image.offsetTop + this.shadedAreaHeight;
                cropWidth = scaleX * this.props.width;
                cropHeight = scaleY * height;
                return [2 /*return*/, this.cropImageAsync(image, {
                        top: top * scaleY,
                        left: left * scaleX,
                        width: cropWidth,
                        height: cropHeight
                    }, width, height)];
            });
        });
    };
    return ImageCropper;
}(React.Component));
exports.ImageCropper = ImageCropper;
