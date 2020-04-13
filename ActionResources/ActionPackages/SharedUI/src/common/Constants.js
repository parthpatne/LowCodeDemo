"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Calendar_1 = require("office-ui-fabric-react/lib/Calendar");
var Constants = /** @class */ (function () {
    function Constants() {
    }
    // ASCII value for carriage return
    Constants.CARRIAGE_RETURN_ASCII_VALUE = 13;
    Constants.ESCAPE_ASCII_VALUE = 27;
    Constants.ACTION_INSTANCE_INDEFINITE_EXPIRY = -1;
    // Default UTC time in minutes for daily notifications.
    Constants.DEFAULT_DAILY_NOTIFICATION_TIME = 330;
    Constants.FOCUSABLE_ITEMS = {
        All: ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', '[tabindex="0"]'],
        LINK: 'a[href]',
        AREA_LINK: 'area[href]',
        INPUT: 'input:not([disabled])',
        SELECT: 'select:not([disabled])',
        TEXTAREA: 'textarea:not([disabled])',
        BUTTON: 'button:not([disabled])',
        TAB: '[tabindex="0"]'
    };
    // The following is a map of locales to their corresponding first day of the week. 
    // This map only contains locales which do not have Sunday as their first day of the week.
    // The source for this data is moment-with-locales.js version 2.24.0
    // Note: The keys in this map should be in lowercase
    Constants.LOCALE_TO_FIRST_DAY_OF_WEEK_MAP = {
        "af": Calendar_1.DayOfWeek.Monday,
        "ar-ly": Calendar_1.DayOfWeek.Saturday,
        "ar-ma": Calendar_1.DayOfWeek.Saturday,
        "ar-tn": Calendar_1.DayOfWeek.Monday,
        "ar": Calendar_1.DayOfWeek.Saturday,
        "az": Calendar_1.DayOfWeek.Monday,
        "be": Calendar_1.DayOfWeek.Monday,
        "bg": Calendar_1.DayOfWeek.Monday,
        "bm": Calendar_1.DayOfWeek.Monday,
        "br": Calendar_1.DayOfWeek.Monday,
        "bs": Calendar_1.DayOfWeek.Monday,
        "ca": Calendar_1.DayOfWeek.Monday,
        "cs": Calendar_1.DayOfWeek.Monday,
        "cv": Calendar_1.DayOfWeek.Monday,
        "cy": Calendar_1.DayOfWeek.Monday,
        "da": Calendar_1.DayOfWeek.Monday,
        "de-at": Calendar_1.DayOfWeek.Monday,
        "de-ch": Calendar_1.DayOfWeek.Monday,
        "de": Calendar_1.DayOfWeek.Monday,
        "el": Calendar_1.DayOfWeek.Monday,
        "en-sg": Calendar_1.DayOfWeek.Monday,
        "en-au": Calendar_1.DayOfWeek.Monday,
        "en-gb": Calendar_1.DayOfWeek.Monday,
        "en-ie": Calendar_1.DayOfWeek.Monday,
        "en-nz": Calendar_1.DayOfWeek.Monday,
        "eo": Calendar_1.DayOfWeek.Monday,
        "es-do": Calendar_1.DayOfWeek.Monday,
        "es": Calendar_1.DayOfWeek.Monday,
        "et": Calendar_1.DayOfWeek.Monday,
        "eu": Calendar_1.DayOfWeek.Monday,
        "fa": Calendar_1.DayOfWeek.Saturday,
        "fi": Calendar_1.DayOfWeek.Monday,
        "fo": Calendar_1.DayOfWeek.Monday,
        "fr-ch": Calendar_1.DayOfWeek.Monday,
        "fr": Calendar_1.DayOfWeek.Monday,
        "fy": Calendar_1.DayOfWeek.Monday,
        "ga": Calendar_1.DayOfWeek.Monday,
        "gd": Calendar_1.DayOfWeek.Monday,
        "gl": Calendar_1.DayOfWeek.Monday,
        "gom-latn": Calendar_1.DayOfWeek.Monday,
        "hr": Calendar_1.DayOfWeek.Monday,
        "hu": Calendar_1.DayOfWeek.Monday,
        "hy-am": Calendar_1.DayOfWeek.Monday,
        "id": Calendar_1.DayOfWeek.Monday,
        "is": Calendar_1.DayOfWeek.Monday,
        "it-ch": Calendar_1.DayOfWeek.Monday,
        "it": Calendar_1.DayOfWeek.Monday,
        "jv": Calendar_1.DayOfWeek.Monday,
        "ka": Calendar_1.DayOfWeek.Monday,
        "kk": Calendar_1.DayOfWeek.Monday,
        "km": Calendar_1.DayOfWeek.Monday,
        "ku": Calendar_1.DayOfWeek.Saturday,
        "ky": Calendar_1.DayOfWeek.Monday,
        "lb": Calendar_1.DayOfWeek.Monday,
        "lt": Calendar_1.DayOfWeek.Monday,
        "lv": Calendar_1.DayOfWeek.Monday,
        "me": Calendar_1.DayOfWeek.Monday,
        "mi": Calendar_1.DayOfWeek.Monday,
        "mk": Calendar_1.DayOfWeek.Monday,
        "ms-my": Calendar_1.DayOfWeek.Monday,
        "ms": Calendar_1.DayOfWeek.Monday,
        "mt": Calendar_1.DayOfWeek.Monday,
        "my": Calendar_1.DayOfWeek.Monday,
        "nb": Calendar_1.DayOfWeek.Monday,
        "nl-be": Calendar_1.DayOfWeek.Monday,
        "nl": Calendar_1.DayOfWeek.Monday,
        "nn": Calendar_1.DayOfWeek.Monday,
        "pl": Calendar_1.DayOfWeek.Monday,
        "pt": Calendar_1.DayOfWeek.Monday,
        "ro": Calendar_1.DayOfWeek.Monday,
        "ru": Calendar_1.DayOfWeek.Monday,
        "sd": Calendar_1.DayOfWeek.Monday,
        "se": Calendar_1.DayOfWeek.Monday,
        "sk": Calendar_1.DayOfWeek.Monday,
        "sl": Calendar_1.DayOfWeek.Monday,
        "sq": Calendar_1.DayOfWeek.Monday,
        "sr-cyrl": Calendar_1.DayOfWeek.Monday,
        "sr": Calendar_1.DayOfWeek.Monday,
        "ss": Calendar_1.DayOfWeek.Monday,
        "sv": Calendar_1.DayOfWeek.Monday,
        "sw": Calendar_1.DayOfWeek.Monday,
        "tet": Calendar_1.DayOfWeek.Monday,
        "tg": Calendar_1.DayOfWeek.Monday,
        "tl-ph": Calendar_1.DayOfWeek.Monday,
        "tlh": Calendar_1.DayOfWeek.Monday,
        "tr": Calendar_1.DayOfWeek.Monday,
        "tzl": Calendar_1.DayOfWeek.Monday,
        "tzm-latn": Calendar_1.DayOfWeek.Saturday,
        "tzm": Calendar_1.DayOfWeek.Saturday,
        "ug-cn": Calendar_1.DayOfWeek.Monday,
        "uk": Calendar_1.DayOfWeek.Monday,
        "ur": Calendar_1.DayOfWeek.Monday,
        "uz-latn": Calendar_1.DayOfWeek.Monday,
        "uz": Calendar_1.DayOfWeek.Monday,
        "vi": Calendar_1.DayOfWeek.Monday,
        "x-pseudo": Calendar_1.DayOfWeek.Monday,
        "yo": Calendar_1.DayOfWeek.Monday,
        "zh-cn": Calendar_1.DayOfWeek.Monday
    };
    Constants.colors = {
        defaultBackgroundColor: '#fff',
        darkBackgroundColor: '#252423',
        contrastBackgroundColor: 'black'
    };
    return Constants;
}());
exports.Constants = Constants;
