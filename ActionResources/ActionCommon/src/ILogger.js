"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel_1 = require("./LogLevel");
var LogMetricState_1 = require("./LogMetricState");
var ActionError_1 = require("./ActionError");
/**
 * Each log statement will by default log the below properties:
 * CorrelationId
 * HostSessionId
 * HostClientType
 * TenantId
 * UserId
 * GroupId
 * GroupAADId
 * ActionPackageId
 * ActionViewName
 * ActionInstanceId
 * Locale
 * KasBaseUrl
 * KasBuildVersion
 */
var ILogger = /** @class */ (function () {
    function ILogger() {
    }
    /**
     * Category: ActionLogs
     * Priority: High
     * Api to log any error message
     */
    ILogger.logError = function (logTag, logMessage) {
        this.logInternal(LogLevel_1.LogLevel.Error, logTag, logMessage);
    };
    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any warning message
     */
    ILogger.logWarning = function (logTag, logMessage) {
        this.logInternal(LogLevel_1.LogLevel.Warning, logTag, logMessage);
    };
    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any informative message
     */
    ILogger.logInfo = function (logTag, logMessage) {
        this.logInternal(LogLevel_1.LogLevel.Info, logTag, logMessage);
    };
    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any debug message - only applicable for dev builds
     */
    ILogger.logVerbose = function (logTag, logMessage) {
        this.logInternal(LogLevel_1.LogLevel.Verbose, logTag, logMessage);
    };
    /**
     * Category: None
     * Priority: None
     * Api to log any diagnostic message - only visible in diagnostic view
     */
    ILogger.logDiagnostic = function (logTag, logMessage) {
        this.logInternal(LogLevel_1.LogLevel.Diagnostic, logTag, logMessage);
    };
    /**
     * Category: ActionEvents
     * Priority: Normal
     * Api to log any event with custom properties
     */
    ILogger.logEvent = function (eventName, eventProps) {
        if (eventProps === void 0) { eventProps = null; }
        this.logEventInternal(eventName, eventProps);
    };
    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log a standalone metric along with its duration
     */
    ILogger.logMetric = function (metricName, metricDuration, metricProps) {
        if (metricProps === void 0) { metricProps = null; }
        this.logMetricInternal(LogMetricState_1.LogMetricState.Standalone, metricName, metricProps, metricDuration);
    };
    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log a metric start - duration can be logged in conjunction with an end marker
     */
    ILogger.logMetricStart = function (metricName, metricProps) {
        if (metricProps === void 0) { metricProps = null; }
        this.logMetricInternal(LogMetricState_1.LogMetricState.Start, metricName, metricProps);
    };
    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log metric end - works in conjunction with a start marker
     */
    ILogger.logMetricEnd = function (metricName, metricProps) {
        if (metricProps === void 0) { metricProps = null; }
        this.logMetricInternal(LogMetricState_1.LogMetricState.End, metricName, metricProps);
    };
    ////////////// Protected APIs //////////////
    ILogger.logInternal = function (logLevel, logTag, logMessage) {
        this.throwError();
    };
    ILogger.logEventInternal = function (eventName, eventProps) {
        if (eventProps === void 0) { eventProps = null; }
        this.throwError();
    };
    ILogger.logMetricInternal = function (metricState, metricName, metricProps, metricDuration) {
        if (metricProps === void 0) { metricProps = null; }
        if (metricDuration === void 0) { metricDuration = 0; }
        this.throwError();
    };
    ////////////// Private APIs //////////////
    ILogger.throwError = function () {
        var error = {
            errorCode: ActionError_1.ActionErrorCode.InvalidOperation,
            errorMessage: "Implement in derived class"
        };
        throw error;
    };
    return ILogger;
}());
exports.ILogger = ILogger;
