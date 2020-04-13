import { LogLevel } from "./LogLevel";
import { LogMetricState } from "./LogMetricState";
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
export declare class ILogger {
    /**
     * Category: ActionLogs
     * Priority: High
     * Api to log any error message
     */
    static logError(logTag: string, logMessage: string): void;
    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any warning message
     */
    static logWarning(logTag: string, logMessage: string): void;
    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any informative message
     */
    static logInfo(logTag: string, logMessage: string): void;
    /**
     * Category: ActionLogs
     * Priority: Low
     * Api to log any debug message - only applicable for dev builds
     */
    static logVerbose(logTag: string, logMessage: string): void;
    /**
     * Category: None
     * Priority: None
     * Api to log any diagnostic message - only visible in diagnostic view
     */
    static logDiagnostic(logTag: string, logMessage: string): void;
    /**
     * Category: ActionEvents
     * Priority: Normal
     * Api to log any event with custom properties
     */
    static logEvent(eventName: string, eventProps?: any): void;
    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log a standalone metric along with its duration
     */
    static logMetric(metricName: string, metricDuration: number, metricProps?: any): void;
    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log a metric start - duration can be logged in conjunction with an end marker
     */
    static logMetricStart(metricName: string, metricProps?: any): void;
    /**
     * Category: ActionMetrics
     * Priority: Normal
     * Api to log metric end - works in conjunction with a start marker
     */
    static logMetricEnd(metricName: string, metricProps?: any): void;
    /**
     * Category: ActionExceptions
     * Priority: High
     * Api to log any exception - a hang or a crash
     */
    static logException(exceptionType: string, exceptionDetail: string, exceptionProps?: any): void;
    protected static logInternal(logLevel: LogLevel, logTag: string, logMessage: string): void;
    protected static logEventInternal(eventName: string, eventProps?: any): void;
    protected static logMetricInternal(metricState: LogMetricState, metricName: string, metricProps?: any, metricDuration?: number): void;
    protected static logExceptionInternal(exceptionType: string, exceptionDetail: string, exceptionProps?: any): void;
    private static throwError;
}
