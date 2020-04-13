import { orchestrator } from "satcheljs"
import {
    updateDueDate,
    fetchNonResponders,
    fetchMemberCount,
    fetchMyResponse,
    fetchLocalization,
    fetchActionInstance,
    fetchActionInstanceRows,
    fetchActionInstanceSummary,
    actionInstanceSendReminder,
    updateSummary,
    initialize,
    setContext,
    updateActionInstance,
    fetchUserDetails,
    updateUserProfileMap,
    setCurrentView,
    setProgressStatus,
    addLog,
    updateMyRows,
    fetchUserProfilePic,
    updateUserProfilePic,
    updateMemberCount,
    addActionInstanceRows,
    updateContinuationToken,
    updateCurrentResponseIndex,
    surveyCloseAlertOpen,
    surveyDeleteAlertOpen,
    surveyExpiryChangeAlertOpen,
    updateNonResponders,
    closeSurvey,
    deleteSurvey,
    downloadCSV,
    showResponseView,
    setIsActionDeleted
} from "../actions/SummaryActions";
import { initializeExternal } from "../actions/ResponseActions";
import getStore, { SummaryPageViewType, ResponsesListViewType } from '../store/summary/Store';
import * as ActionSDK from "@actionSDK";
import { ProgressState, Constants } from "@sharedUI";
import { fetchMyResponses } from '../common/Utils';

const LOG_TAG = "SurveySummary";

const handleErrorResponse = (error: ActionSDK.ActionError) => {
    if (error.errorProps  && error.errorProps.statusCode == ActionSDK.HttpStatusCode.NotFound) {
        setIsActionDeleted(true);
    }
};

orchestrator(initialize, () => {
    if (getStore().progressStatus.currentContext == ProgressState.NotStarted
        || getStore().progressStatus.currentContext == ProgressState.Failed) {
        setProgressStatus({ currentContext: ProgressState.InProgress });
        ActionSDK.APIs.getCurrentContext()
            .then((actionContext: ActionSDK.ActionContext) => {
                if (getStore().context == null) {
                    setContext(actionContext);
                }

                fetchLocalization();
                fetchActionInstance(true);
                fetchActionInstanceSummary();
                fetchMyResponse();
                fetchMemberCount();
                setProgressStatus({ currentContext: ProgressState.Completed });
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchCurrentContext failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ currentContext: ProgressState.Failed });
            });
    }
});

orchestrator(fetchLocalization, (msg) => {
    if (getStore().progressStatus.localizationState == ProgressState.NotStarted
        || getStore().progressStatus.localizationState == ProgressState.Failed) {
        setProgressStatus({ localizationState: ProgressState.InProgress });
        ActionSDK.Localizer.initialize()
            .then(() => {
                setProgressStatus({ localizationState: ProgressState.Completed });
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchLocalization failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ localizationState: ProgressState.Failed });
            });
    }
})

orchestrator(actionInstanceSendReminder, () => {
    if (getStore().context.ecsSettings && getStore().context.ecsSettings.IsNotificationEnabled) {
        setProgressStatus({ reminder: ProgressState.InProgress });
        ActionSDK.APIs.sendActionInstanceReminder(getStore().context.actionInstanceId).then((value: boolean) => {
            value ? setProgressStatus({ reminder: ProgressState.Completed }) : setProgressStatus({ reminder: ProgressState.Failed });
        }).catch((error: ActionSDK.ActionError) => {
            addLog(ActionSDK.LogLevel.Error, `actionInstanceSendReminder failed, Error: ${error.errorCode}, ${error.errorMessage}`);
            setProgressStatus({ reminder: ProgressState.Failed });
            handleErrorResponse(error);
        });
    }
});

orchestrator(fetchMyResponse, () => {
    if (getStore().progressStatus.myActionInstanceRow == ProgressState.NotStarted
        || getStore().progressStatus.myActionInstanceRow == ProgressState.Failed) {
        setProgressStatus({ myActionInstanceRow: ProgressState.InProgress });
        fetchMyResponses(getStore().context)
            .then((rows) => {
                updateMyRows(rows);
                fetchUserDetails([getStore().context.userId]);
                setProgressStatus({ myActionInstanceRow: ProgressState.Completed });
            }).catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchMyResponse failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ myActionInstanceRow: ProgressState.Failed });
            });
    }
});

orchestrator(fetchMemberCount, (msg) => {
    if (getStore().progressStatus.memberCount == ProgressState.NotStarted
        || getStore().progressStatus.memberCount == ProgressState.Failed) {
        setProgressStatus({ memberCount: ProgressState.InProgress });
        ActionSDK.APIs.getConversationMembersCount(getStore().context.conversationInfo, getStore().context.actionInstanceId)
            .then((memberCount: ActionSDK.MemberCount) => {
                updateMemberCount(memberCount);
                setProgressStatus({ memberCount: ProgressState.Completed });
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchMemberCount failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ memberCount: ProgressState.Failed });
                handleErrorResponse(error);
            });
    }
})

orchestrator(fetchActionInstance, (msg) => {
    if (getStore().progressStatus.actionInstance != ProgressState.InProgress) {
        if (msg.updateState) {
            setProgressStatus({ actionInstance: ProgressState.InProgress });
        }
        ActionSDK.APIs.getActionInstance(getStore().context.actionInstanceId)
            .then((actionInstance: ActionSDK.ActionInstance) => {
                updateActionInstance(actionInstance);
                if (msg.updateState) {
                    setProgressStatus({ actionInstance: ProgressState.Completed })
                }
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchActionInstance failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                if (msg.updateState) {
                    setProgressStatus({ actionInstance: ProgressState.Failed })
                }
                handleErrorResponse(error);
            });
    }
});

orchestrator(fetchUserDetails, (msg) => {
    let userIds: string[] = msg.userIds;
    ActionSDK.APIs.getUserProfiles(userIds, getStore().context.actionInstanceId)
        .then((userProfilesFetchResult: ActionSDK.UserProfilesFetchResult) => {
            if (userProfilesFetchResult) {
                updateUserProfileMap(userProfilesFetchResult.userIdToProfileMap);
                fetchUserProfilePic(Object.keys(userProfilesFetchResult.userIdToProfileMap));
            }
        })
        .catch((error: ActionSDK.ActionError) => {
            addLog(ActionSDK.LogLevel.Error, `fetchUserDetails failed, Error: ${error.errorCode}, ${error.errorMessage}`);
        });
});

orchestrator(fetchUserProfilePic, (msg) => {
    let userIds: string[] = msg.userIds;

    if (msg.userIds.length > 10) {
        fetchUserProfilePic(userIds.slice(10, userIds.length));
        userIds = userIds.slice(0, 10);
    }

    ActionSDK.APIs.getUserProfilePhotos(userIds)
        .then((profilePhotosFetchResult: ActionSDK.ProfilePhotosFetchResult) => {
            updateUserProfilePic(profilePhotosFetchResult.userIdToPhotoMap);
        })
        .catch((error: ActionSDK.ActionError) => {
            addLog(ActionSDK.LogLevel.Error, `fetchUserProfilePic failed, Error: ${error.errorCode}, ${error.errorMessage}`);
        });
});

orchestrator(fetchActionInstanceRows, (msg) => {
    if (getStore().progressStatus.actionInstanceRow == ProgressState.Partial
        || getStore().progressStatus.actionInstanceRow == ProgressState.Failed
        || getStore().progressStatus.actionInstanceRow == ProgressState.NotStarted) {
        setProgressStatus({ actionInstanceRow: ProgressState.InProgress });

        ActionSDK.APIs.getActionInstanceRows(getStore().context.actionInstanceId, null, getStore().continuationToken, 30)
            .then((result: ActionSDK.ActionInstanceRowsFetchResult) => {

                let rows: ActionSDK.ActionInstanceRow[] = [];
                for (var row of result.rows) {
                    rows.push(row);
                }

                let userIds: string[] = [];
                for (var row of rows) {
                    userIds.push(row.creatorId);
                }

                addActionInstanceRows(rows);
                if (userIds.length > 0) {
                    fetchUserDetails(userIds);
                }
                if (result.continuationToken) {
                    updateContinuationToken(result.continuationToken);
                    setProgressStatus({ actionInstanceRow: ProgressState.Partial });
                } else {
                    setProgressStatus({ actionInstanceRow: ProgressState.Completed });
                }
            }).catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchActionInstanceRows failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ actionInstanceRow: ProgressState.Failed });
                handleErrorResponse(error);
            });;
    }
});

orchestrator(fetchNonResponders, () => {
    if (getStore().progressStatus.nonResponder == ProgressState.NotStarted
        || getStore().progressStatus.nonResponder == ProgressState.Failed) {
        setProgressStatus({ nonResponder: ProgressState.InProgress });
        ActionSDK.APIs.getActionInstanceNonResponders(getStore().context.actionInstanceId)
            .then((nonResponder: ActionSDK.NonResponder) => {
                let userProfile: { [key: string]: ActionSDK.UserProfile } = {}
                nonResponder.nonResponders.forEach((user: ActionSDK.UserProfile) => {
                    userProfile[user.id] = user;
                });
                updateUserProfileMap(userProfile);
                fetchUserProfilePic(Object.keys(userProfile));
                updateNonResponders(nonResponder);
                setProgressStatus({ nonResponder: ProgressState.Completed });
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchNonReponders failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ nonResponder: ProgressState.Failed });
                handleErrorResponse(error);
            });
    }
});

orchestrator(closeSurvey, () => {
    if (getStore().progressStatus.closeActionInstance != ProgressState.InProgress) {
        let failedCallback = () => {
            setProgressStatus({ closeActionInstance: ProgressState.Failed });
            fetchActionInstance(false);
        };

        setProgressStatus({ closeActionInstance: ProgressState.InProgress });
        var actionInstanceUpdateInfo: ActionSDK.ActionInstanceUpdateInfo = {
            version: getStore().actionInstance.version,
            status: ActionSDK.ActionInstanceStatus.Closed
        };
        ActionSDK.APIs.updateActionInstance(getStore().context.actionInstanceId, actionInstanceUpdateInfo)
            .then((success: boolean) => {
                if (success) {
                    surveyCloseAlertOpen(false);
                    ActionSDK.APIs.dismissScreen();
                } else {
                    addLog(ActionSDK.LogLevel.Error, `closeSurvey failed, Error: not success`);
                    failedCallback();
                }
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `closeSurvey failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                failedCallback();
                handleErrorResponse(error);
            });
    }
});

orchestrator(deleteSurvey, () => {
    if (getStore().progressStatus.deleteActionInstance != ProgressState.InProgress) {
        let failedCallback = () => {
            setProgressStatus({ deleteActionInstance: ProgressState.Failed });
            fetchActionInstance(false);
        };

        setProgressStatus({ deleteActionInstance: ProgressState.InProgress });
        ActionSDK.APIs.deleteActionInstance(getStore().context.actionInstanceId)
            .then((success: boolean) => {
                if (success) {
                    surveyDeleteAlertOpen(false);
                    ActionSDK.APIs.dismissScreen();
                } else {
                    addLog(ActionSDK.LogLevel.Error, `deleteSurvey failed, Error: not success`);
                    failedCallback();
                }
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `deleteSurvey failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                failedCallback();
                handleErrorResponse(error);
            });
    }
});

orchestrator(updateDueDate, (actionMessage) => {
    if (getStore().progressStatus.updateActionInstance != ProgressState.InProgress) {
        let callback = (success: boolean) => {
            setProgressStatus({ updateActionInstance: success ? ProgressState.Completed : ProgressState.Failed });
            fetchActionInstance(false);
        };

        setProgressStatus({ updateActionInstance: ProgressState.InProgress });
        var actionInstanceUpdateInfo: ActionSDK.ActionInstanceUpdateInfo = {
            version: getStore().actionInstance.version,
            expiry: actionMessage.dueDate
        };
        ActionSDK.APIs.updateActionInstance(getStore().context.actionInstanceId, actionInstanceUpdateInfo)
            .then((success: boolean) => {
                if (success) {
                    callback(true)
                    surveyExpiryChangeAlertOpen(false);
                } else {
                    addLog(ActionSDK.LogLevel.Error, `updateDueDate failed, Error: not success`);
                    callback(false);
                }
            }).catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `updateDueDate failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                callback(false);
                handleErrorResponse(error);
            });
    }
});

orchestrator(fetchActionInstanceSummary, () => {
    if (getStore().progressStatus.actionSummary != ProgressState.InProgress) {
        setProgressStatus({ actionSummary: ProgressState.InProgress });
        ActionSDK.APIs.getActionInstanceSummary(getStore().context.actionInstanceId, false /* isShortSummary */)
            .then((aggregatedSummary: ActionSDK.ActionInstanceSummary) => {
                updateSummary(aggregatedSummary);
                setProgressStatus({ actionSummary: ProgressState.Completed });
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `fetchActionInstanceSummary failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ actionSummary: ProgressState.Failed });
                handleErrorResponse(error);
            });
    }
});

orchestrator(downloadCSV, (msg) => {
    if (getStore().progressStatus.downloadData != ProgressState.InProgress) {
        setProgressStatus({ downloadData: ProgressState.InProgress });
        ActionSDK.APIs.downloadActionInstanceResult(getStore().context.actionInstanceId,
            ActionSDK.Localizer.getString("SurveyResult", getStore().actionInstance.title).substring(0, Constants.ACTION_RESULT_FILE_NAME_MAX_LENGTH))
            .then((success) => {
                setProgressStatus({ downloadData: ProgressState.Completed });
            })
            .catch((error: ActionSDK.ActionError) => {
                addLog(ActionSDK.LogLevel.Error, `downloadCSV failed, Error: ${error.errorCode}, ${error.errorMessage}`);
                setProgressStatus({ downloadData: ProgressState.Failed });
                handleErrorResponse(error);
            })
    }
});

orchestrator(addLog, (msg) => {
    if (msg.loglevel == ActionSDK.LogLevel.Error) {
        ActionSDK.Logger.logError(LOG_TAG, msg.message);
        ActionSDK.Logger.logDiagnostic(LOG_TAG, msg.message);
    } else {
        ActionSDK.Logger.logInfo(LOG_TAG, msg.message);
    }
});


orchestrator(showResponseView, (msg) => {
    let index: number = msg.index;
    if (index >= 0 && msg.responses && index < msg.responses.length) {
        initializeExternal(getStore().actionInstance, msg.responses[index]);
        updateCurrentResponseIndex(index);
        setCurrentView(SummaryPageViewType.ResponseView);
    }
});