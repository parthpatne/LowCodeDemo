"use strict";
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
var Constants_1 = require("./Constants");
var ActionSDK = require("@actionSDK");
var UxUtils = /** @class */ (function () {
    function UxUtils() {
    }
    UxUtils.getTabKeyProps = function () {
        return __assign({ tabIndex: 0, role: "button" }, this.getClickOnCarriageReturnHandler());
    };
    UxUtils.getTabKeyPropsRoleRadio = function () {
        return __assign({ tabIndex: 0, role: "radio" }, this.getClickOnCarriageReturnHandler());
    };
    UxUtils.getListItemProps = function () {
        return __assign({ "data-is-focusable": "true" }, UxUtils.getClickOnCarriageReturnHandler());
    };
    UxUtils.getClickOnCarriageReturnHandler = function () {
        return {
            onKeyUp: function (event) {
                if ((event.which || event.keyCode) == Constants_1.Constants.CARRIAGE_RETURN_ASCII_VALUE) {
                    event.currentTarget.click();
                }
            }
        };
    };
    UxUtils.getTappableInputWrapperRole = function () {
        if (this.renderingForiOS()) {
            return {
                role: "combobox"
            };
        }
        return {
            role: "button"
        };
    };
    UxUtils.renderingForMobile = function () {
        var currentHostClientType = document.body.getAttribute("data-hostclienttype");
        return currentHostClientType && (currentHostClientType == "ios" || currentHostClientType == "android");
    };
    UxUtils.renderingForiOS = function () {
        var currentHostClientType = document.body.getAttribute("data-hostclienttype");
        return currentHostClientType && (currentHostClientType == "ios");
    };
    UxUtils.setFocus = function (element, customSelectorTypes) {
        if (customSelectorTypes && customSelectorTypes.length > 0 && element) {
            var queryString = customSelectorTypes.join(", ");
            var focusableItem = element.querySelector(queryString);
            if (focusableItem) {
                focusableItem.focus();
            }
        }
    };
    UxUtils.renderingForAndroid = function () {
        var currentHostClientType = document.body.getAttribute("data-hostclienttype");
        return currentHostClientType && (currentHostClientType === "android");
    };
    UxUtils.formatDate = function (selectedDate, locale, options) {
        var dateOptions = options ? options : { year: "numeric", month: "long", day: "2-digit", hour: "numeric", minute: "numeric" };
        var formattedDate = selectedDate.toLocaleDateString(locale, dateOptions);
        //check if M01, M02, ...M12 pattern is present in the string, if pattern is present, using numeric representation of the month instead
        if (formattedDate.match(/M[\d]{2}/)) {
            var newOptions = __assign(__assign({}, dateOptions), { 'month': '2-digit' });
            formattedDate = selectedDate.toLocaleDateString(locale, newOptions);
        }
        return formattedDate;
    };
    UxUtils.getBackgroundColorForTheme = function (theme) {
        var backColor = Constants_1.Constants.colors.defaultBackgroundColor;
        switch (ActionSDK.Utils.getNonNullString(theme).toLowerCase()) {
            case "dark":
                backColor = Constants_1.Constants.colors.darkBackgroundColor;
                break;
            case "contrast":
                backColor = Constants_1.Constants.colors.contrastBackgroundColor;
                break;
        }
        return backColor;
    };
    return UxUtils;
}());
exports.UxUtils = UxUtils;
