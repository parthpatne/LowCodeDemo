"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ActionSDK = require("@actionSDK");
/**
 * A functional component which reads out the alert on screen
 * Functional components are supposed to start with uppercase
 * While calling make sure you have only 1 alert per screen
 * @param alertText :text which will be read out
 */
function AccessibilityAlert(props) {
    return (!ActionSDK.Utils.isEmptyString(props.alertText)
        && React.createElement("div", { role: "alert", "aria-label": props.alertText }));
}
exports.AccessibilityAlert = AccessibilityAlert;
