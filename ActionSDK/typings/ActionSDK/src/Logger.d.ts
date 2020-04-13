import { ILogger, LogLevel, LogMetricState } from '@actionCommon';
export declare class Logger extends ILogger {
    protected static logInternal(logLevel: LogLevel, logTag: string, logMessage: string): void;
    protected static logEventInternal(eventName: string, eventProps?: any): void;
    protected static logMetricInternal(metricState: LogMetricState, metricName: string, metricProps?: any, metricDuration?: number): void;
    protected static logExceptionInternal(exceptionType: string, exceptionDetail: string, exceptionProps?: any): void;
}
