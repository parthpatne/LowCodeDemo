"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InitializationState;
(function (InitializationState) {
    InitializationState[InitializationState["NotInitialized"] = 1] = "NotInitialized";
    InitializationState[InitializationState["Initialized"] = 2] = "Initialized";
    InitializationState[InitializationState["Failed"] = 3] = "Failed";
})(InitializationState = exports.InitializationState || (exports.InitializationState = {}));
var ProgressState;
(function (ProgressState) {
    ProgressState[ProgressState["NotStarted"] = 0] = "NotStarted";
    ProgressState[ProgressState["InProgress"] = 1] = "InProgress";
    ProgressState[ProgressState["Partial"] = 2] = "Partial";
    ProgressState[ProgressState["Completed"] = 3] = "Completed";
    ProgressState[ProgressState["Failed"] = 4] = "Failed";
})(ProgressState = exports.ProgressState || (exports.ProgressState = {}));
