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
Object.defineProperty(exports, "__esModule", { value: true });
var ActionHostInterface_1 = require("./ActionHostInterface");
var _actionCommon_1 = require("@actionCommon");
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Logger.logInternal = function (logLevel, logTag, logMessage) {
        ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.LogTelemetry, [_actionCommon_1.LogCategory.ActionLogs, logLevel, logTag, logMessage]);
    };
    Logger.logEventInternal = function (eventName, eventProps) {
        if (eventProps === void 0) { eventProps = null; }
        ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.LogTelemetry, [_actionCommon_1.LogCategory.ActionEvents, eventName, eventProps]);
    };
    Logger.logMetricInternal = function (metricState, metricName, metricProps, metricDuration) {
        if (metricProps === void 0) { metricProps = null; }
        if (metricDuration === void 0) { metricDuration = 0; }
        ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.LogTelemetry, [_actionCommon_1.LogCategory.ActionMetrics, metricState, metricName, metricProps, metricDuration]);
    };
    return Logger;
}(_actionCommon_1.ILogger));
exports.Logger = Logger;
