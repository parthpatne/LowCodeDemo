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
var Calendar_1 = require("office-ui-fabric-react/lib/Calendar");
require("./DatePickerView.scss");
var styling_1 = require("@uifabric/styling");
var FocusZone_1 = require("@stardust-ui/react/dist/es/lib/accessibility/FocusZone");
var common_1 = require("../common");
styling_1.registerIcons({
    icons: {
        'chevronLeft': React.createElement(react_1.Icon, { name: "chevron-down", rotate: 90 }),
        'chevronRight': React.createElement(react_1.Icon, { name: "chevron-down", rotate: 270 })
    }
});
var dayPickerStrings = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    prevMonthAriaLabel: 'Previous month',
    nextMonthAriaLabel: 'Next month',
    goToToday: ""
};
var DatePickerView = /** @class */ (function (_super) {
    __extends(DatePickerView, _super);
    function DatePickerView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showCalendar: false,
            selectedDate: _this.props.date
        };
        _this.initializeDate();
        return _this;
    }
    DatePickerView.getDerivedStateFromProps = function (props, state) {
        return {
            showCalendar: state.showCalendar,
            selectedDate: props.date
        };
    };
    DatePickerView.prototype.render = function () {
        if (this.props.renderForMobile) {
            return this.renderDatePickerForMobile();
        }
        else {
            return this.renderDatePickerForWebOrDesktop();
        }
    };
    DatePickerView.prototype.renderDatePickerForMobile = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            this.renderDatePickerPreviewView(),
            React.createElement("input", { ref: function (dateInputRef) {
                    _this.dateInputRef = dateInputRef;
                }, type: "date", "aria-label": this.state.selectedDate ? this.state.selectedDate.toLocaleDateString(this.props.locale, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }) : null, className: "hidden-date-input-mob", disabled: this.props.disabled, min: new Date().toISOString().slice(0, 10), value: this.state.selectedDate ? this.state.selectedDate.toString() : null, onChange: function (e) {
                    if (!_this.props.disabled && e.target.value) {
                        _this.onDateSelected(new Date(e.target.value));
                    }
                }, "aria-hidden": true })));
    };
    DatePickerView.prototype.renderDatePickerForWebOrDesktop = function () {
        var _this = this;
        return (React.createElement(react_1.Popup, { align: "start", position: "below", open: !this.props.disabled && this.state.showCalendar, onOpenChange: function (e, data) {
                _this.setState(function (prevState) {
                    prevState.showCalendar = data.open;
                    return prevState;
                });
            }, trigger: this.renderDatePickerPreviewView(), content: React.createElement(FocusZone_1.FocusTrapZone
            /*
                This traps the focus within the Calendar component below.
                On clicking outside the calendar, the calendar is dismissed.
                Special handling is added for Esc key to dismiss the calendar using keyboard.
            */
            , { 
                /*
                    This traps the focus within the Calendar component below.
                    On clicking outside the calendar, the calendar is dismissed.
                    Special handling is added for Esc key to dismiss the calendar using keyboard.
                */
                onKeyDown: function (e) {
                    if (!e.repeat && (e.keyCode || e.which) == common_1.Constants.ESCAPE_ASCII_VALUE && _this.state.showCalendar) {
                        _this.setState({
                            showCalendar: false
                        });
                    }
                } },
                React.createElement(Calendar_1.Calendar, { onSelectDate: function (date) {
                        _this.onDateSelected(date);
                    }, isMonthPickerVisible: false, value: this.state.selectedDate, firstDayOfWeek: this.getFirstDayOfWeek(), strings: dayPickerStrings, isDayPickerVisible: true, showGoToToday: false, minDate: this.props.minDate, navigationIcons: {
                        leftNavigation: 'chevronLeft',
                        rightNavigation: 'chevronRight'
                    } })) }));
    };
    DatePickerView.prototype.renderDatePickerPreviewView = function () {
        var _this = this;
        var wrapperClassName = "date-input-view date-picker-preview-container";
        if (this.props.renderForMobile) {
            wrapperClassName += " date-input-view-mob";
        }
        var dateOptions = { month: 'short', day: '2-digit', year: 'numeric' };
        if (this.props.disabled) {
            wrapperClassName += " cursor-default";
        }
        var inputWrapperProps = __assign({ tabIndex: -1, "aria-label": (this.props.renderForMobile && this.state.selectedDate) ? this.state.selectedDate.toLocaleDateString(this.props.locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + ". " + this.props.placeholder : null, onClick: function () {
                _this.onDatePickerPreviewTap();
            }, className: wrapperClassName, "aria-expanded": this.state.showCalendar }, common_1.UxUtils.getTappableInputWrapperRole());
        var inputProps = {
            disabled: this.props.disabled,
            type: "text",
            placeholder: this.props.placeholder,
            "aria-hidden": true,
            value: this.state.selectedDate ? common_1.UxUtils.formatDate(this.state.selectedDate, this.props.locale, dateOptions) : null,
            readOnly: true,
            "aria-readonly": false
        };
        return (React.createElement(react_1.Input, { input: __assign({}, inputProps), wrapper: __assign({}, inputWrapperProps), icon: this.calendarIconProp() }));
    };
    DatePickerView.prototype.calendarIconProp = function () {
        var _this = this;
        return {
            name: "calendar",
            outline: true,
            className: this.props.disabled ? "cursor-default" : "calendar-icon",
            onClick: function () {
                _this.onDatePickerPreviewTap();
            }
        };
    };
    DatePickerView.prototype.onDatePickerPreviewTap = function () {
        if (!this.props.disabled) {
            if (this.props.renderForMobile && this.dateInputRef) {
                this.dateInputRef.click();
                this.dateInputRef.focus();
            }
            else {
                this.setState({
                    showCalendar: !this.state.showCalendar
                });
            }
        }
    };
    DatePickerView.prototype.onDateSelected = function (date) {
        if (!this.isValidDate(date)) {
            return;
        }
        this.props.onSelectDate && this.props.onSelectDate(date);
        this.setState({
            showCalendar: false,
            selectedDate: date
        });
    };
    DatePickerView.prototype.isValidDate = function (date) {
        if (this.props.minDate) {
            if (date.getFullYear() > this.props.minDate.getFullYear()) {
                return true;
            }
            else if (date.getFullYear() == this.props.minDate.getFullYear()) {
                if (date.getMonth() > this.props.minDate.getMonth()) {
                    return true;
                }
                else if (date.getMonth() == this.props.minDate.getMonth()) {
                    return (date.getDate() >= this.props.minDate.getDate());
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    };
    DatePickerView.prototype.initializeDate = function () {
        // Date for Sunday in Jan month
        var date = new Date("1970-01-04T00:00");
        var locale = this.props.locale;
        for (var i = 0; i < 7; i++) {
            dayPickerStrings.days[i] = date.toLocaleDateString(locale, { weekday: 'long' });
            dayPickerStrings.shortDays[i] = date.toLocaleDateString(locale, { weekday: 'narrow' });
            date.setDate(date.getDate() + 1);
        }
        for (var i = 0; i < 12; i++) {
            dayPickerStrings.months[i] = date.toLocaleDateString(locale, { month: 'long' });
            dayPickerStrings.shortMonths[i] = date.toLocaleDateString(locale, { month: 'short' });
            date.setMonth(date.getMonth() + 1);
        }
    };
    DatePickerView.prototype.getFirstDayOfWeek = function () {
        if (this.props.locale && common_1.Constants.LOCALE_TO_FIRST_DAY_OF_WEEK_MAP.hasOwnProperty(this.props.locale.toLowerCase())) {
            return common_1.Constants.LOCALE_TO_FIRST_DAY_OF_WEEK_MAP[this.props.locale.toLowerCase()];
        }
        return Calendar_1.DayOfWeek.Sunday;
    };
    return DatePickerView;
}(React.Component));
exports.DatePickerView = DatePickerView;
