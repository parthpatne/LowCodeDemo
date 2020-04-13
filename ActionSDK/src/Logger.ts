import { Host } from "./ActionHostInterface";
import {
    ActionSdkCommand,
    ILogger,
    LogCategory,
    LogLevel,
    LogMetricState
} from '@actionCommon';

export class Logger extends ILogger {
    protected static logInternal(logLevel: LogLevel, logTag: string, logMessage: string) {
        Host.executeActionSDKApi(ActionSdkCommand.LogTelemetry, [LogCategory.ActionLogs, logLevel, logTag, logMessage]);
    }

    protected static logEventInternal(eventName: string, eventProps: any = null) {
        Host.executeActionSDKApi(ActionSdkCommand.LogTelemetry, [LogCategory.ActionEvents, eventName, eventProps]);
    }

    protected static logMetricInternal(metricState: LogMetricState, metricName: string, metricProps: any = null, metricDuration: number = 0) {
        Host.executeActionSDKApi(ActionSdkCommand.LogTelemetry, [LogCategory.ActionMetrics, metricState, metricName, metricProps, metricDuration]);
    }
}