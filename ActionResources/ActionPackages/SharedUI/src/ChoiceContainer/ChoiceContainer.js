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
var _sharedUI_1 = require("@sharedUI");
require("./ChoiceContainer.scss");
var InputBox_1 = require("../InputBox");
var react_1 = require("@stardust-ui/react");
var common_1 = require("../common");
var ChoiceContainer = /** @class */ (function (_super) {
    __extends(ChoiceContainer, _super);
    function ChoiceContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.currentFocus = -1;
        return _this;
    }
    ChoiceContainer.prototype.getDeleteIconProps = function (i) {
        var _this = this;
        if (this.props.options.length > 2) {
            return __assign({ name: "trash-can", className: "choice-trash-can", outline: true, 'aria-hidden': 'false', title: this.props.options[i].deleteChoiceLabel, onClick: function () {
                    if (_this.currentFocus == _this.props.options.length - 1) {
                        setTimeout((function () {
                            _this.addButtonRef.focus();
                        }).bind(_this), 0);
                    }
                    _this.props.onDeleteChoice(i);
                } }, _sharedUI_1.UxUtils.getTabKeyProps());
        }
        return null;
    };
    ChoiceContainer.prototype.render = function () {
        var _this = this;
        var items = [];
        var maxOptions = (this.props.limit && this.props.limit > 0) ? this.props.limit : Number.MAX_VALUE;
        var focusOnErrorSet = false;
        var className = ('item-content' + ((this.props.options.length > 2) ? ' icon-padding' : ''));
        var _loop_1 = function (i) {
            errorString = this_1.props.optionsError && this_1.props.optionsError.length > i ? this_1.props.optionsError[i] : "";
            if (errorString.length > 0 && this_1.props.focusOnError && !focusOnErrorSet) {
                this_1.currentFocus = i;
                focusOnErrorSet = true;
            }
            if (errorString.length > 0 && this_1.props.inputClassName) {
                className = className + ' ' + this_1.props.inputClassName;
            }
            items.push(React.createElement("div", { key: "option" + i, className: "choice-item" },
                React.createElement(InputBox_1.InputBox, { ref: function (inputBox) {
                        if (inputBox && i == _this.currentFocus)
                            inputBox.focus();
                    }, fluid: true, input: { className: className }, icon: this_1.getDeleteIconProps(i), showError: errorString.length > 0, errorText: errorString, key: "option" + i, value: this_1.props.options[i].value, placeholder: this_1.props.options[i].choicePlaceholder, onKeyDown: function (e) {
                        if (!e.repeat && (e.keyCode || e.which) == common_1.Constants.CARRIAGE_RETURN_ASCII_VALUE && _this.props.options.length < maxOptions) {
                            if (i == _this.props.options.length - 1) {
                                _this.props.onAddChoice();
                                _this.currentFocus = _this.props.options.length;
                            }
                            else {
                                _this.currentFocus += 1;
                                _this.forceUpdate();
                            }
                        }
                    }, onFocus: function (e) {
                        _this.currentFocus = i;
                    }, onChange: function (e) {
                        _this.props.onUpdateChoice(i, e.target.value);
                    }, prefixJSX: this_1.props.options[i].choicePrefix })));
        };
        var this_1 = this, errorString;
        for (var i = 0; i < (maxOptions > this.props.options.length ? this.props.options.length : maxOptions); i++) {
            _loop_1(i);
        }
        return (React.createElement("div", { className: 'choice-container', onBlur: function (e) {
                _this.currentFocus = -1;
            } },
            this.props.title && React.createElement("div", { className: this.getChoiceTitleClassName() }, this.props.title),
            items,
            this.props.options.length < maxOptions &&
                React.createElement("div", __assign({ ref: function (e) {
                        _this.addButtonRef = e;
                    }, className: this.props.className ? this.props.className + " add-options" : "add-options" }, _sharedUI_1.UxUtils.getTabKeyProps(), { onClick: function (e) {
                        _this.props.onAddChoice();
                        _this.currentFocus = _this.props.options.length;
                    } }),
                    React.createElement(react_1.Icon, { className: "plus-icon", name: "add", outline: true, size: "medium", color: "brand" }),
                    React.createElement(react_1.Text, { size: "medium", content: this.props.strings.addChoice ? this.props.strings.addChoice : "Add Choice", color: "brand" }))));
    };
    ChoiceContainer.prototype.getChoiceTitleClassName = function () {
        return this.props.renderForMobile ? "choice-title-mob" : "choice-title";
    };
    return ChoiceContainer;
}(React.PureComponent));
exports.ChoiceContainer = ChoiceContainer;
