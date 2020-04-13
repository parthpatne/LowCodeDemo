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
require("./TimePickerView.scss");
var FocusZone_1 = require("@stardust-ui/react/dist/es/lib/accessibility/FocusZone");
var common_1 = require("../common");
var TimePickerView = /** @class */ (function (_super) {
    __extends(TimePickerView, _super);
    function TimePickerView(props) {
        var _this = _super.call(this, props) || this;
        var timePickerList = TimePickerView.getTimePickerList(_this.props.minTimeInMinutes, _this.props.locale);
        _this.state = {
            showPicker: false,
            selectedTimePickerItem: timePickerList.length > 0 ? TimePickerView.getTimePickerListItem(_this.props.defaultTimeInMinutes, timePickerList) : null,
            timePickerItemsList: timePickerList,
            prevMinTimeInMinutes: _this.props.minTimeInMinutes
        };
        if (_this.state.selectedTimePickerItem) {
            _this.props.onTimeChange(_this.state.selectedTimePickerItem.hours * 60 + _this.state.selectedTimePickerItem.minutes);
        }
        return _this;
    }
    TimePickerView.getDerivedStateFromProps = function (props, state) {
        if (state.prevMinTimeInMinutes == props.minTimeInMinutes) {
            return null;
        }
        var timePickerList = TimePickerView.getTimePickerList(props.minTimeInMinutes, props.locale);
        return {
            selectedTimePickerItem: TimePickerView.listContainsItem(timePickerList, state.selectedTimePickerItem) ? state.selectedTimePickerItem : timePickerList[0],
            timePickerItemsList: timePickerList,
            prevMinTimeInMinutes: props.minTimeInMinutes
        };
    };
    TimePickerView.getTimePickerList = function (minTimeInMinutes, locale) {
        var timePickerList = [];
        for (var i = 0; i < 24; i++) {
            if (!minTimeInMinutes || i * 60 > minTimeInMinutes) {
                timePickerList.push(new TimePickerItem(i, 0, locale));
            }
            if (!minTimeInMinutes || i * 60 + 30 > minTimeInMinutes) {
                timePickerList.push(new TimePickerItem(i, 30, locale));
            }
        }
        return timePickerList;
    };
    TimePickerView.getTimePickerListItem = function (timeInMinutes, timePickerList) {
        var selectedIndex = 0;
        for (var i = 0; i < timePickerList.length; i++) {
            var item = timePickerList[i];
            if (timeInMinutes <= item.hours * 60 + item.minutes) {
                selectedIndex = i;
                break;
            }
        }
        return timePickerList.length > 0 ? timePickerList[selectedIndex] : null;
    };
    TimePickerView.prototype.render = function () {
        return (this.props.renderForMobile ?
            this.renderTimePickerForMobile()
            :
                this.renderTimePickerForWebOrDesktop());
    };
    TimePickerView.prototype.renderTimePickerForMobile = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            this.renderTimePickerPreviewView(),
            React.createElement("input", { ref: function (timeInputRef) {
                    _this.timeInputRef = timeInputRef;
                }, type: "time", "aria-label": this.state.selectedTimePickerItem.asString, className: "hidden-time-input-mob", value: this.state.selectedTimePickerItem.value, onChange: function (e) {
                    var valueInMinutes = Math.floor(e.target.valueAsNumber / 60000);
                    if (!_this.isTimeValid(valueInMinutes)) {
                        return;
                    }
                    var selectedTime = new TimePickerItem(Math.floor(valueInMinutes / 60), valueInMinutes % 60, _this.props.locale);
                    _this.setState({
                        selectedTimePickerItem: selectedTime
                    });
                    if (_this.props.onTimeChange) {
                        _this.props.onTimeChange(selectedTime.hours * 60 + selectedTime.minutes);
                    }
                }, "aria-hidden": true })));
    };
    TimePickerView.prototype.renderTimePickerForWebOrDesktop = function () {
        var _this = this;
        var timePickerItems = [];
        var selectedIndex = this.getSelectedIndex();
        for (var itemIter = 0; itemIter < this.state.timePickerItemsList.length; itemIter++) {
            var item = this.state.timePickerItemsList[itemIter];
            timePickerItems.push({
                key: "tpItem-" + item.asString,
                content: item.asString,
                className: "list-item",
                tabIndex: (itemIter == selectedIndex ? 0 : -1)
            });
        }
        return (React.createElement(react_1.Popup, { align: "start", position: "below", open: this.state.showPicker, onOpenChange: function (e, data) {
                /*
                The following isTrusted check is added to prevent any non-user generated events from
                closing the Popup.
                When the TimePicker is used within a RadioGroup, like in the case of Notification Settings,
                when the Enter key is pressed to open the popup, it actually trigers two events: one from
                the Input element and the other from the underlying radio item. While the first event
                opens the popup, the second event closes it immediately as it is treated as a click outside the popup.
                Since the second event is not user generated, the isTrusted flag will be false and we will
                ignore it here.
                 */
                if (e.isTrusted) {
                    _this.setState({
                        showPicker: data.open
                    });
                }
            }, trigger: this.renderTimePickerPreviewView(), content: timePickerItems.length > 0 &&
                React.createElement(FocusZone_1.FocusTrapZone
                /*
                    This traps the focus within the List component below.
                    On clicking outside the list, the list is dismissed.
                    Special handling is added for Esc key to dismiss the list using keyboard.
                */
                , { 
                    /*
                        This traps the focus within the List component below.
                        On clicking outside the list, the list is dismissed.
                        Special handling is added for Esc key to dismiss the list using keyboard.
                    */
                    onKeyDown: function (e) {
                        if (!e.repeat && (e.keyCode || e.which) == common_1.Constants.ESCAPE_ASCII_VALUE && _this.state.showPicker) {
                            _this.setState({
                                showPicker: false
                            });
                        }
                    } },
                    React.createElement("div", { className: "time-picker-items-list-container" },
                        React.createElement(react_1.List, { selectable: true, defaultSelectedIndex: selectedIndex, items: timePickerItems, onSelectedIndexChange: function (e, props) {
                                var selectedItem = _this.state.timePickerItemsList[props.selectedIndex];
                                _this.setState({
                                    showPicker: !_this.state.showPicker,
                                    selectedTimePickerItem: selectedItem
                                });
                                if (_this.props.onTimeChange) {
                                    _this.props.onTimeChange(selectedItem.hours * 60 + selectedItem.minutes);
                                }
                            } }))) }));
    };
    TimePickerView.prototype.renderTimePickerPreviewView = function () {
        var _this = this;
        var wrapperClassName = "time-input-view time-picker-preview-container";
        if (this.props.renderForMobile) {
            wrapperClassName += " time-input-view-mob";
        }
        var inputWrapperProps = __assign({ tabIndex: -1, "aria-label": (this.props.renderForMobile && this.state.selectedTimePickerItem) ? this.state.selectedTimePickerItem.asString + ". " + this.props.placeholder : null, onClick: function () {
                _this.onTimePickerPreviewTap();
            }, className: wrapperClassName, "aria-expanded": this.state.showPicker }, common_1.UxUtils.getTappableInputWrapperRole());
        var inputProps = {
            type: "text",
            placeholder: this.props.placeholder,
            "aria-hidden": true,
            value: this.state.selectedTimePickerItem.asString,
            readOnly: true,
            "aria-readonly": false
        };
        return (React.createElement(react_1.Input, { input: __assign({}, inputProps), wrapper: __assign({}, inputWrapperProps), icon: this.timePickerChevronIcon() }));
    };
    TimePickerView.prototype.timePickerChevronIcon = function () {
        var _this = this;
        return {
            name: "chevron-down",
            className: "chevron",
            outline: true,
            onClick: function () {
                _this.onTimePickerPreviewTap();
            }
        };
    };
    TimePickerView.prototype.onTimePickerPreviewTap = function () {
        if (this.props.renderForMobile && this.timeInputRef) {
            this.timeInputRef.click();
            this.timeInputRef.focus();
        }
        else {
            this.setState({
                showPicker: !this.state.showPicker
            });
        }
    };
    TimePickerView.prototype.isTimeValid = function (minutes) {
        if (isNaN(minutes)) {
            return false;
        }
        else if (this.props.minTimeInMinutes && minutes < this.props.minTimeInMinutes) {
            return false;
        }
        return true;
    };
    TimePickerView.prototype.getSelectedIndex = function () {
        var index = 0;
        for (var i = 0; i < this.state.timePickerItemsList.length; i++) {
            if (this.state.timePickerItemsList[i].asString == this.state.selectedTimePickerItem.asString) {
                index = i;
                break;
            }
        }
        return index;
    };
    TimePickerView.listContainsItem = function (timePickerItemList, item) {
        for (var _i = 0, timePickerItemList_1 = timePickerItemList; _i < timePickerItemList_1.length; _i++) {
            var pickerItem = timePickerItemList_1[_i];
            if (pickerItem.value == item.value) {
                return true;
            }
        }
        return false;
    };
    return TimePickerView;
}(React.Component));
exports.TimePickerView = TimePickerView;
var TimePickerItem = /** @class */ (function () {
    function TimePickerItem(hours, minutes, locale) {
        if (locale === void 0) { locale = navigator.language; }
        this.hours = hours;
        this.minutes = minutes;
        this.value = this.hours + ":" + this.minutes;
        var date = new Date();
        date.setHours(this.hours);
        date.setMinutes(this.minutes);
        this.asString = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return TimePickerItem;
}());
