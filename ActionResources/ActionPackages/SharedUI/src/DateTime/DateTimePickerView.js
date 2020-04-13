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
var react_1 = require("@stardust-ui/react");
var DatePickerView_1 = require("./DatePickerView");
var TimePickerView_1 = require("./TimePickerView");
var DateTimePickerView = /** @class */ (function (_super) {
    __extends(DateTimePickerView, _super);
    function DateTimePickerView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selectedDate: _this.props.value,
            selectedTime: DateTimePickerView.getTimeInMinutes(_this.props.value ? _this.props.value : new Date())
        };
        _this.props.onSelect(_this.state.selectedDate);
        return _this;
    }
    DateTimePickerView.getDerivedStateFromProps = function (props, state) {
        return {
            selectedDate: props.value,
            selectedTime: DateTimePickerView.getTimeInMinutes(props.value ? props.value : new Date())
        };
    };
    DateTimePickerView.prototype.render = function () {
        var _this = this;
        var props = {
            placeholder: this.props.placeholderDate,
            date: this.state.selectedDate,
            minDate: this.props.minDate,
            disabled: this.props.disabled,
            locale: this.props.locale,
            renderForMobile: this.props.renderForMobile,
            onSelectDate: function (newDate) {
                if (!_this.props.isPreview) {
                    _this.dateSelectCallback(newDate);
                }
            }
        };
        var timePickerProps = {
            placeholder: this.props.placeholderTime,
            minTimeInMinutes: this.getMinTimeInMinutes(this.state.selectedDate),
            defaultTimeInMinutes: DateTimePickerView.getTimeInMinutes(this.state.selectedDate),
            renderForMobile: this.props.renderForMobile,
            onTimeChange: function (minutes) {
                _this.timeSelectCallback(minutes);
            },
            locale: this.props.locale
        };
        return (React.createElement(react_1.Flex, { gap: this.props.renderForMobile ? null : "gap.small", space: this.props.renderForMobile ? "between" : null },
            React.createElement(DatePickerView_1.DatePickerView, __assign({}, props)),
            this.props.showTimePicker ? React.createElement(TimePickerView_1.TimePickerView, __assign({}, timePickerProps)) : null));
    };
    DateTimePickerView.prototype.dateSelectCallback = function (newDate) {
        var updatedDate = newDate;
        if (this.props.showTimePicker) {
            if (this.getMinTimeInMinutes(newDate) <= this.state.selectedTime) {
                updatedDate.setHours(Math.floor(this.state.selectedTime / 60));
                updatedDate.setMinutes(this.state.selectedTime % 60);
                this.setState({
                    selectedDate: updatedDate
                });
            }
            else {
                var updatedHours = Math.floor(this.getMinTimeInMinutes(newDate) / 60);
                var updatedMinutes = this.getMinTimeInMinutes(newDate) % 60;
                if (updatedMinutes > 0 && updatedMinutes <= 30) {
                    updatedMinutes = 30;
                }
                else if (updatedMinutes > 31) {
                    updatedHours += 1;
                    updatedMinutes = 0;
                }
                updatedDate.setHours(updatedHours);
                updatedDate.setMinutes(updatedMinutes);
                this.setState({
                    selectedDate: updatedDate,
                    selectedTime: updatedHours * 60 + updatedMinutes
                });
            }
        }
        else {
            this.setState({
                selectedDate: updatedDate
            });
        }
        this.props.onSelect(updatedDate);
    };
    DateTimePickerView.prototype.timeSelectCallback = function (minutes) {
        var updatedDate = this.state.selectedDate;
        updatedDate.setHours(Math.floor(minutes / 60));
        updatedDate.setMinutes(minutes % 60);
        this.setState({
            selectedTime: minutes
        });
        this.props.onSelect(updatedDate);
    };
    DateTimePickerView.prototype.getMinTimeInMinutes = function (givenDate) {
        var isSelectedDateToday = false;
        var today = new Date();
        if (givenDate) {
            isSelectedDateToday =
                givenDate.getDate() == today.getDate() &&
                    givenDate.getMonth() == today.getMonth() &&
                    givenDate.getFullYear() == today.getFullYear();
        }
        var minTime = 0;
        if (isSelectedDateToday) {
            minTime = today.getHours() * 60 + today.getMinutes();
        }
        return minTime;
    };
    DateTimePickerView.getTimeInMinutes = function (givenDate) {
        var defaultTime = 0;
        if (givenDate) {
            defaultTime = givenDate.getHours() * 60 + givenDate.getMinutes();
        }
        return defaultTime;
    };
    return DateTimePickerView;
}(React.Component));
exports.DateTimePickerView = DateTimePickerView;
