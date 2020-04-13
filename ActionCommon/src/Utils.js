"use strict";
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
var ActionError_1 = require("./ActionError");
var uuid = require("uuid");
var Utils;
(function (Utils) {
    Utils.YEARS = "YEARS";
    Utils.MONTHS = "MONTHS";
    Utils.WEEKS = "WEEKS";
    Utils.DAYS = "DAYS";
    Utils.HOURS = "HOURS";
    Utils.MINUTES = "MINUTES";
    Utils.DEFAULT_LOCALE = "en";
    function parseUrlQueries(url) {
        if (isEmptyString(url) || url.indexOf("?") === -1) {
            return null;
        }
        var params = {};
        // Separate the queries part
        var queries = url.substr(url.indexOf("?") + 1);
        if (!isEmptyString(queries)) {
            // Decode the queries
            queries = decodeURIComponent(queries);
            // Split the queries to get key-value pairs
            var keyValuePairs = queries.split("&");
            for (var _i = 0, keyValuePairs_1 = keyValuePairs; _i < keyValuePairs_1.length; _i++) {
                var keyValuePair = keyValuePairs_1[_i];
                var keyValue = keyValuePair.split("=");
                if (!isEmptyString(keyValue[0]) && !isEmptyString(keyValue[1])) {
                    params[keyValue[0]] = keyValue[1];
                }
            }
        }
        return params;
    }
    Utils.parseUrlQueries = parseUrlQueries;
    function isValidJson(json) {
        try {
            JSON.parse(JSON.stringify(json));
            return true;
        }
        catch (e) {
            return false;
        }
    }
    Utils.isValidJson = isValidJson;
    // To avoid HTML injections, we sanitize all HTML tags
    // by replacing all '<' with '&lt;' and '>' with '&gt;'
    function sanitizeHtmlTags(str) {
        if (isEmptyString(str))
            return str;
        var tagsToReplace = {
            "<": "&lt;",
            ">": "&gt;"
        };
        var sanitizedString = str.replace(/[&<>]/g, function (tag) {
            return tagsToReplace[tag] || tag;
        });
        return sanitizedString;
    }
    Utils.sanitizeHtmlTags = sanitizeHtmlTags;
    function executeFunction(funcNameWithNamespaces, args) {
        if (args === void 0) { args = []; }
        var components = funcNameWithNamespaces.split(".");
        var func;
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (!func) {
                func = window[component];
            }
            else {
                func = func[component];
            }
        }
        func(args);
    }
    Utils.executeFunction = executeFunction;
    function replaceCharacterInString(str, oldChar, newChar) {
        return str.split(oldChar).join(newChar);
    }
    Utils.replaceCharacterInString = replaceCharacterInString;
    function jsonIsArray(json) {
        return Object.prototype.toString.call(json) === "[object Array]";
    }
    Utils.jsonIsArray = jsonIsArray;
    function isEmptyString(str) {
        return isEmptyObject(str);
    }
    Utils.isEmptyString = isEmptyString;
    function isEmptyObject(obj) {
        if (obj == undefined || obj == null) {
            return true;
        }
        var isEmpty = false;
        if (typeof obj === "number" || typeof obj === "boolean") {
            isEmpty = false;
        }
        else if (typeof obj === "string") {
            isEmpty = obj.trim().length == 0;
        }
        else if (Array.isArray(obj)) {
            isEmpty = obj.length == 0;
        }
        else if (typeof obj === "object") {
            if (isValidJson(obj)) {
                isEmpty = JSON.stringify(obj) == "{}";
            }
        }
        return isEmpty;
    }
    Utils.isEmptyObject = isEmptyObject;
    function parseJson(jsonString, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        try {
            return JSON.parse(jsonString);
        }
        catch (e) {
            return defaultValue || {};
        }
    }
    Utils.parseJson = parseJson;
    function stringifyJson(obj) {
        try {
            if (isEmptyObject(obj)) {
                return null;
            }
            return JSON.stringify(obj);
        }
        catch (e) {
            return null;
        }
    }
    Utils.stringifyJson = stringifyJson;
    function getTimeRemaining(deadLineDate) {
        var now = new Date().getTime();
        var deadLineTime = deadLineDate.getTime();
        var minutes = 0;
        var hours = 0;
        var days = 0;
        var weeks = 0;
        var months = 0;
        var years = 0;
        var diff = Math.abs(deadLineTime - now);
        if (diff > 0) {
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
            var weeks = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
            var months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
            var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        }
        return {
            YEARS: years,
            MONTHS: months,
            WEEKS: weeks,
            DAYS: days,
            HOURS: hours,
            MINUTES: minutes,
        };
    }
    Utils.getTimeRemaining = getTimeRemaining;
    function getDefaultExpiry(activeDays) {
        var date = new Date();
        date.setDate(date.getDate() + activeDays);
        // round off to next 30 minutes time multiple
        if (date.getMinutes() > 30) {
            date.setMinutes(0);
            date.setHours(date.getHours() + 1);
        }
        else {
            date.setMinutes(30);
        }
        return date;
    }
    Utils.getDefaultExpiry = getDefaultExpiry;
    function isServerURL(url) {
        if (!isEmptyString(url) && url.match(/^https?:\/\//)) {
            return true;
        }
        return false;
    }
    Utils.isServerURL = isServerURL;
    function generateGUID() {
        return uuid.v4();
    }
    Utils.generateGUID = generateGUID;
    function getValues(map) {
        var values = [];
        for (var key in map) {
            values.push(map[key]);
        }
        return values;
    }
    Utils.getValues = getValues;
    function getMaxValue(values) {
        var result = Number.MIN_VALUE;
        for (var i = 0; i < values.length; i++) {
            result = Math.max(result, values[i]);
        }
        return result;
    }
    Utils.getMaxValue = getMaxValue;
    function downloadContent(fileName, data) {
        if (data && fileName) {
            var a = document.createElement("a");
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
    Utils.downloadContent = downloadContent;
    function isRTL(locale) {
        var rtlLang = ['ar', 'he', 'fl'];
        if (locale && rtlLang.indexOf(locale.split('-')[0]) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }
    Utils.isRTL = isRTL;
    // read a local file's blob Object as ArrayBuffer
    function readBlobAsync(blob) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(blob);
                        reader.onloadend = function () {
                            resolve(reader.result);
                        };
                        reader.onerror = function (e) {
                            var error = {
                                errorCode: ActionError_1.ActionErrorCode.IOException,
                                errorMessage: "Error in reading blobUrl: " + e
                            };
                            reject(error);
                        };
                    })];
            });
        });
    }
    Utils.readBlobAsync = readBlobAsync;
    function dateTimeToLocaleString(date, locale, options) {
        var dateOptions = options ? options
            : { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
        return date.toLocaleDateString(locale ? locale : Utils.DEFAULT_LOCALE, dateOptions);
    }
    Utils.dateTimeToLocaleString = dateTimeToLocaleString;
    function announceText(text) {
        var ariaLiveSpan = document.getElementById("aria-live-span");
        if (ariaLiveSpan) {
            ariaLiveSpan.innerText = text;
        }
        else {
            ariaLiveSpan = document.createElement("SPAN");
            ariaLiveSpan.style.cssText = "position: fixed; overflow: hidden; width: 0px; height: 0px;";
            ariaLiveSpan.id = "aria-live-span";
            ariaLiveSpan.innerText = "";
            ariaLiveSpan.setAttribute("aria-live", "polite");
            ariaLiveSpan.tabIndex = -1;
            document.body.appendChild(ariaLiveSpan);
            setTimeout(function () {
                ariaLiveSpan.innerText = text;
            }, 50);
        }
    }
    Utils.announceText = announceText;
    function getNonNullString(str) {
        if (isEmptyObject(str)) {
            return "";
        }
        else {
            return str;
        }
    }
    Utils.getNonNullString = getNonNullString;
})(Utils = exports.Utils || (exports.Utils = {}));
