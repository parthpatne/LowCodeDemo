import { orchestrator } from "satcheljs";
import { initialize, setActionInstance, sendResponse, setValidationModeOn, setAppInitialized, setSendingFlag, setCurrentView, setSavedActionInstanceRow, showResponseView, updateCurrentResponseIndex, setMyResponses, setResponseViewMode, setCurrentResponse, setContext, initializeNavBarButtons, setResponseSubmissionFailed, updateTopMostErrorIndex, setIsActionDeleted } from "../actions/ResponseActions";
import getStore, { ResponsePageViewType, ResponseViewMode } from "../store/response/Store";
import { toJS } from "mobx";
import * as ActionSDK from "@actionSDK";
import { InitializationState, UxUtils } from "@sharedUI";
import { fetchMyResponses, isValidResponse } from '../common/Utils';
import { RESPONSE_LOG_TAG, NAV_BAR_MENUITEM_EDIT_RESPONSE_ID, NAV_BAR_MENUITEM_SUBMIT_RESPONSE_ID } from "../common/Constants";

const handleErrorResponse = (error: ActionSDK.ActionError) => {
    if (error.errorProps && error.errorProps.statusCode == ActionSDK.HttpStatusCode.NotFound) {
        setIsActionDeleted(true);
    }
};

orchestrator(initialize, () => {
    ActionSDK.APIs.getCurrentContext()
        .then((context: ActionSDK.ActionContext) => {
            setContext(context);
            Promise.all([ActionSDK.Localizer.initialize(), fetchActionInstanceNow(), fetchMyResponsesNow()])
                .then((results) => {

                    if (!getStore().actionInstance.canUserAddMultipleRows && getStore().myResponses.length > 0) {
                        setCurrentResponse(getStore().myResponses[0]);
                        setResponseViewMode(ResponseViewMode.DisabledResponse);
                    }
                    setSavedActionInstanceRow(toJS(getStore().response.row));
                    setAppInitialized(InitializationState.Initialized);
                })
                .catch((error) => {
                    ActionSDK.Logger.logError(RESPONSE_LOG_TAG, error);
                    setAppInitialized(InitializationState.Failed);
                })
        })
        .catch(error => {
            ActionSDK.Logger.logError(RESPONSE_LOG_TAG, error);
            setAppInitialized(InitializationState.Failed);
        });
});

function fetchActionInstanceNow(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        ActionSDK.APIs.getActionInstance(getStore().context.actionInstanceId)
            .then((actionInstance: ActionSDK.ActionInstance) => {
                setActionInstance(actionInstance);
                resolve(true);
            })
            .catch(error => {
                handleErrorResponse(error);
                reject(error)
            });
    });
}

function fetchMyResponsesNow(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        fetchMyResponses(getStore().context)
            .then((rows) => {
                setMyResponses(rows);
                resolve(true);
            })
            .catch(error => {
                reject(error)
            });
    });
}



orchestrator(sendResponse, () => {
    setValidationModeOn();
    if (getStore().actionInstance && getStore().actionInstance.columns.length > 0) {
        let columns = toJS(getStore().actionInstance.columns);
        let row = toJS(getStore().response.row);
        for (let i = 0; i < columns.length; i++) {
            if (!isValidResponse(row[columns[i].id], columns[i].isOptional, columns[i].type)) {
                updateTopMostErrorIndex(i + 1);
                setSendingFlag(false);
                return;
            }
        }
        let actionInstanceRow: ActionSDK.ActionInstanceRow = {
            id: getStore().response.id ? getStore().response.id : "",
            isUpdate: getStore().response.id ? true : false,
            row: row
        };
        if (getStore().actionInstance.canUserAddMultipleRows) {
            actionInstanceRow.id = "";
            actionInstanceRow.isUpdate = false;
        }
        setSendingFlag(true);
        setResponseSubmissionFailed(false);
        ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("SubmittingResponse"));
        ActionSDK.ActionUtils.prepareActionInstanceRow(actionInstanceRow);
        ActionSDK.APIs.createOrUpdateActionInstanceRows(getStore().context.actionInstanceId, [actionInstanceRow])
            .then((success: boolean) => {
                if (success) {
                    ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("Submitted"));
                    ActionSDK.APIs.dismissScreen();
                } else {
                    setResponseSubmissionFailed(true);
                    setSendingFlag(false);
                    ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("SubmissionFailed"));
                }
            }).catch(error => {
                setResponseSubmissionFailed(true);
                setSendingFlag(false);
                handleErrorResponse(error);
                ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("SubmissionFailed"));
            });
    }
});

orchestrator(initializeNavBarButtons, () => {
    if (!UxUtils.renderingForMobile()) {
        return;
    }
    let menuItem: ActionSDK.NavBarMenuItem;
    if (getStore().responseViewMode === ResponseViewMode.DisabledResponse) {
        menuItem = {
            title: ActionSDK.Localizer.getString("Edit"),
            enabled: true,
            id: NAV_BAR_MENUITEM_EDIT_RESPONSE_ID
        };
    } else {
        let menuItemTitle: string = getStore().responseViewMode === ResponseViewMode.UpdateResponse ? ActionSDK.Localizer.getString("Update") : ActionSDK.Localizer.getString("Submit");
        menuItem = {
            title: menuItemTitle,
            enabled: !getStore().isSendActionInProgress,
            id: NAV_BAR_MENUITEM_SUBMIT_RESPONSE_ID
        };
    }
    ActionSDK.APIs.setNavBarMenuItems([menuItem], (id: string) => {
        navBarMenuCallback(id);
    });
});

function navBarMenuCallback(id: string) {
    if (!UxUtils.renderingForMobile()) {
        return;
    }
    if (id == NAV_BAR_MENUITEM_SUBMIT_RESPONSE_ID) {
        sendResponse();
    } else if (id == NAV_BAR_MENUITEM_EDIT_RESPONSE_ID) {
        setResponseViewMode(ResponseViewMode.UpdateResponse);
    }
}

orchestrator(showResponseView, (msg) => {
    let index: number = msg.index;
    if (index >= 0 && msg.responses && index < msg.responses.length) {
        setActionInstance(getStore().actionInstance);
        setCurrentResponse(msg.responses[index]);
        updateCurrentResponseIndex(index);
        setCurrentView(ResponsePageViewType.SelectedResponseView);
    }
});