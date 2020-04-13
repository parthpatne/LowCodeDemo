import { LogLevel } from "./LogLevel";
import { LogMetricState } from "./LogMetricState";
import { ActionError, ActionErrorCode } from "./ActionError";

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
export class ILogger {
    /**
     * Category: ActionLogs
     * Priority: High
     * Api to log any error message
     */
    public static logError(logTag: string, logMessage: string) {
        this.logInternal(LogLevel.Error, logTag, logMessage);
    }

    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any warning message
     */
    public static logWarning(logTag: string, logMessage: string) {
        this.logInternal(LogLevel.Warning, logTag, logMessage);
    }

    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any informative message
     */
    public static logInfo(logTag: string, logMessage: string) {
        this.logInternal(LogLevel.Info, logTag, logMessage);
    }

    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any debug message - only applicable for dev builds
     */
    public static logVerbose(logTag: string, logMessage: string) {
        this.logInternal(LogLevel.Verbose, logTag, logMessage);
    }

    /**
     * Category: None
     * Priority: None
     * Api to log any diagnostic message - only visible in diagnostic view
     */
    public static logDiagnostic(logTag: string, logMessage: string) {
        this.logInternal(LogLevel.Diagnostic, logTag, logMessage);
    }

    /**
     * Category: ActionEvents
     * Priority: Normal
     * Api to log any event with custom properties
     */
    public static logEvent(eventName: string, eventProps: any = null) {
        this.logEventInternal(eventName, eventProps);
    }

    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log a standalone metric along with its duration
     */
    public static logMetric(metricName: string, metricDuration: number, metricProps: any = null) {
        this.logMetricInternal(LogMetricState.Standalone, metricName, metricProps, metricDuration);
    }

    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log a metric start - duration can be logged in conjunction with an end marker
     */
    public static logMetricStart(metricName: string, metricProps: any = null) {
        this.logMetricInternal(LogMetricState.Start, metricName, metricProps);
    }

    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log metric end - works in conjunction with a start marker
     */
    public static logMetricEnd(metricName: string, metricProps: any = null) {
        this.logMetricInternal(LogMetricState.End, metricName, metricProps);
    }

    ////////////// Protected APIs //////////////

    protected static logInternal(logLevel: LogLevel, logTag: string, logMessage: string) {
        this.throwError();
    }

    protected static logEventInternal(eventName: string, eventProps: any = null) {
        this.throwError();
    }

    protected static logMetricInternal(metricState: LogMetricState, metricName: string, metricProps: any = null, metricDuration: number = 0) {
        this.throwError();
    }

    ////////////// Private APIs //////////////

    private static throwError() {
        let error: ActionError = {
            errorCode: ActionErrorCode.InvalidOperation,
            errorMessage: "Implement in derived class"
        };
        throw error;
    }
}