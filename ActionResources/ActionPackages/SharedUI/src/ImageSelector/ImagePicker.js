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
var ActionSDK = require("@actionSDK");
var react_1 = require("@stardust-ui/react");
var allowedImageTypes = ["jpg", "jpeg", "png"];
var ImagePicker = /** @class */ (function (_super) {
    __extends(ImagePicker, _super);
    function ImagePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.onSelectFile = function (e) {
            if (e.target.files && e.target.files.length == 1) {
                var file = e.target.files[0];
                var extBeginIndex = file.name.lastIndexOf(".") + 1;
                var fileExt = file.name.substring(extBeginIndex);
                if (!allowedImageTypes.includes(fileExt.toLowerCase())) {
                    return;
                }
                _this.imageObj = {
                    type: ActionSDK.AttachmentType.Image,
                    name: file.name,
                    id: ActionSDK.Utils.generateGUID(),
                    bytes: file.size,
                    url: window.URL.createObjectURL(file)
                };
                if (_this.props.onFileSelected)
                    _this.props.onFileSelected(_this.imageObj);
            }
        };
        _this.inputRef = React.createRef();
        return _this;
    }
    ImagePicker.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { onClick: function (e) { return _this.inputRef.current.click(); } },
            React.createElement(react_1.Input, { type: "file", inputRef: this.inputRef, id: "coverImageInput", onChange: this.onSelectFile, accept: "image/x-png,image/gif,image/jpeg", style: { display: "none" } }),
            this.props.trigger));
    };
    return ImagePicker;
}(React.Component));
exports.ImagePicker = ImagePicker;
