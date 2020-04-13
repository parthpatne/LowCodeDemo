export declare enum ActionErrorCode {
    Unknown = "Unknown",
    Unauthorized = "Unauthorized",
    ServerError = "ServerError",
    BadRequest = "BadRequest",
    UnsupportedApi = "UnsupportedApi",
    InvalidOperation = "InvalidOperation"
}
export interface ActionError {
    errorCode: ActionErrorCode;
    errorMessage: string;
}
