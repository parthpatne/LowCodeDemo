"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionInstancePropertyType;
(function (ActionInstancePropertyType) {
    /** Any text is allowed as the metadata value */
    ActionInstancePropertyType["Text"] = "Text";
    /** Only numbers are allowed as the metadata value */
    ActionInstancePropertyType["Numeric"] = "Numeric";
    /** Location type as the metadata value */
    ActionInstancePropertyType["Location"] = "Location";
    /** Date time as the metadata value */
    ActionInstancePropertyType["DateTime"] = "DateTime";
    /** Set (unique list) of strings as the metadata value */
    ActionInstancePropertyType["StringSet"] = "StringSet";
    /** List of Attachment as metadata value */
    ActionInstancePropertyType["AttachmentList"] = "AttachmentList";
})(ActionInstancePropertyType = exports.ActionInstancePropertyType || (exports.ActionInstancePropertyType = {}));
