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
require("./InputBox.scss");
var react_1 = require("@stardust-ui/react");
var ActionSDK = require("@actionSDK");
var errorIcon = {
    name: 'exclamation-circle',
    color: 'red'
};
var RenderAs;
(function (RenderAs) {
    RenderAs[RenderAs["Input"] = 0] = "Input";
    RenderAs[RenderAs["TextArea"] = 1] = "TextArea";
    RenderAs[RenderAs["Span"] = 2] = "Span";
})(RenderAs || (RenderAs = {}));
var InputBox = /** @class */ (function (_super) {
    __extends(InputBox, _super);
    function InputBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderAs = RenderAs.Input;
        _this.incomingInputRef = null;
        _this.bottomBorderWidth = -1;
        return _this;
    }
    InputBox.prototype.componentDidUpdate = function () {
        this.updateInputBox();
    };
    InputBox.prototype.componentDidMount = function () {
        var _this = this;
        if (this.renderAs == RenderAs.TextArea && (!ActionSDK.Utils.isEmptyObject(this.props.value) || !ActionSDK.Utils.isEmptyObject(this.props.defaultValue))) {
            // Updating height only in case when there is some text in input box becasue if there is no text then rows=1 will show only 1 line.
            // There might be some senario in which element is not completely painted to get their scroll height. Refer https://stackoverflow.com/questions/26556436/react-after-render-code
            // In such cases the height of input box become wrong(looks very large or very small), which usaully occurs on very first load.
            // To solve this, trying to adjust the height after window has resize which supposed to be called once load and rendering is done.
            this.updateInputBox();
            window.addEventListener("resize", function () {
                _this.updateInputBox();
            });
        }
        else if (this.renderAs == RenderAs.Span) {
            // Updating inner text as value is not working in span.
            this.updateInputBox();
        }
    };
    InputBox.prototype.render = function () {
        this.setRenderAs();
        return (React.createElement(react_1.Flex, { column: true },
            (this.props.showError && !ActionSDK.Utils.isEmptyObject(this.props.errorText))
                && React.createElement(react_1.Text, { align: "end", error: true }, this.props.errorText),
            this.props.prefixJSX ? this.getInputItem() : this.getInput()));
    };
    InputBox.prototype.setRenderAs = function () {
        if (this.props.multiline) {
            if (this.props.disabled) {
                this.renderAs = RenderAs.Span;
            }
            else {
                this.renderAs = RenderAs.TextArea;
            }
        }
    };
    InputBox.prototype.getInput = function () {
        var _this = this;
        return (React.createElement(react_1.Input, __assign({}, this.getInputProps(), { onChange: function (event, data) {
                _this.autoAdjustHeight();
                if (_this.props.onChange)
                    _this.props.onChange(event, data);
            }, onClick: this.props.disabled ? null : function (event) {
                // Adjusting height if by any reason wrong height get applied in componentDidMount.
                _this.autoAdjustHeight();
                if (_this.props.onClick)
                    _this.props.onClick(event);
            } })));
    };
    InputBox.prototype.updateInputBox = function () {
        if (this.renderAs == RenderAs.TextArea) {
            this.autoAdjustHeight();
        }
        else if (this.renderAs == RenderAs.Span) {
            var text = "";
            if (!ActionSDK.Utils.isEmptyObject(this.props.value)) {
                text = this.props.value.toString();
            }
            else if (!ActionSDK.Utils.isEmptyObject(this.props.defaultValue)) {
                text = this.props.defaultValue.toString();
            }
            this.inputElement.innerText = text;
        }
    };
    InputBox.prototype.autoAdjustHeight = function () {
        if (this.renderAs == RenderAs.TextArea) {
            this.inputElement.style.height = '';
            if (this.bottomBorderWidth == -1) {
                this.bottomBorderWidth = parseFloat(getComputedStyle(this.inputElement).getPropertyValue('border-bottom-width'));
            }
            this.inputElement.style.height = this.inputElement.scrollHeight + this.bottomBorderWidth + 'px';
        }
    };
    InputBox.prototype.getInputProps = function () {
        var _this = this;
        var icon = this.props.icon;
        if (!icon) {
            icon = this.props.showError ? errorIcon : null;
        }
        this.incomingInputRef = this.props.inputRef;
        var inputRef = function (input) {
            _this.inputElement = input;
            if (_this.incomingInputRef) {
                if (typeof _this.incomingInputRef === 'function') {
                    _this.incomingInputRef(input);
                }
                else if (typeof _this.incomingInputRef === 'object') {
                    _this.incomingInputRef.current = input;
                }
            }
        };
        var input = this.props.input;
        if (this.renderAs == RenderAs.TextArea) {
            input = __assign(__assign({}, input), { as: 'textarea', rows: 1 });
        }
        else if (this.renderAs == RenderAs.Span) {
            input = __assign(__assign({}, input), { as: 'span' });
        }
        return __assign(__assign({}, __assign(__assign({}, this.props), { multiline: undefined })), { className: this.getClassName(), icon: icon, inputRef: inputRef, input: input });
    };
    InputBox.prototype.getClassName = function () {
        var classNames = ['multiline-input-box'];
        if (this.props.className)
            classNames.push(this.props.className);
        if (this.props.showError)
            classNames.push('invalid');
        return classNames.join(' ');
    };
    InputBox.prototype.focus = function () {
        if (this.inputElement) {
            this.inputElement.focus();
        }
    };
    InputBox.prototype.getInputItem = function () {
        return (React.createElement(react_1.Flex, { gap: "gap.smaller" },
            this.props.prefixJSX,
            this.getInput()));
    };
    return InputBox;
}(React.Component));
exports.InputBox = InputBox;
