import { validateAndSend } from '../actions/CreationActions';
import { orchestrator } from "satcheljs";
import { uploadCoverImage, sendAction, previewAction, setSendingFlag, setValidationMode, initialize, setAppInitialized, goToPage, updateActiveQuestionIndex, initializeNavBarButtons, setTeamsGroupInitializationState, updateTeamsGroupAndChannels, getTeamsGroupAndChannels, sendActionForPersonalApp, updateCoverImageData, setSendSurveyAlertOpen, setShouldFocusOnError } from "../actions/CreationActions";
import getStore, { Page } from '../store/creation/Store';
import { ResultVisibility, NotificationSettingMode, UxUtils } from "@sharedUI";
import { toJS } from 'mobx';
import { initializeExternal } from "../actions/ResponseActions";
import { isEmptyOrNull, getGeneralChannelIdForGroup, getFirstInvalidQuestionIndex, areAllQuestionsOptional, countErrorsPresent } from "../common/Utils"
import * as ActionSDK from "@actionSDK";
import { InitializationState } from "@sharedUI";
import { COVER_IMAGE_PROP_KEY } from "../common/Constants";
import { SurveyViewData, Questions } from '../SurveyViewData';
import { ActionInstanceColumn } from '@actionSDK';

const LOG_TAG = "CreationOrchestrators";
orchestrator(initialize, () => {
    ActionSDK.Localizer.initialize()
        .then(() => {
            setAppInitialized(InitializationState.Initialized);
        })
        .catch(() => {
            setAppInitialized(InitializationState.Failed);
        });
});

orchestrator(sendAction, () => {
    setSendingFlag(true);
    const coverImageData = getStore().coverImageData;
    if (coverImageData) {
        const coverImageUploadStatus = getStore().coverImageData.uploadStatus;
        if (coverImageUploadStatus == ActionSDK.AttachmentStatus.Uploaded)
            sendActionInstance();
        else if (coverImageUploadStatus == ActionSDK.AttachmentStatus.Uploading) {
            coverImageData.uploadPromise.then(() => sendActionInstance());
        }
    } else {
        sendActionInstance();
    }
});

orchestrator(uploadCoverImage, () => {
    const croppedImage = getStore().coverImageData.coverImage;

    const customPropsDict = ActionSDK.Utils.parseJson(getStore().context.customProps);
    const sasUrl = customPropsDict['sasUrl'];

    const uploadPromise = ActionSDK.AMSClient.uploadBlob(croppedImage, sasUrl);
    updateCoverImageData(croppedImage, ActionSDK.AttachmentStatus.Uploading, uploadPromise);

    uploadPromise.then(url => {
        const updatedcoverImageData = getStore().coverImageData;
        ActionSDK.Logger.logVerbose(LOG_TAG, "Success in uploading to blob");
        const updatedCoverImage = { ...updatedcoverImageData.coverImage, url: url };
        updateCoverImageData(updatedCoverImage, ActionSDK.AttachmentStatus.Uploaded, uploadPromise);
    }
    ).catch(error => {
        updateCoverImageData(getStore().coverImageData.coverImage, ActionSDK.AttachmentStatus.UploadFailed, uploadPromise);
        ActionSDK.Logger.logError(LOG_TAG, "ERROR in uploading file to blob: " + error);
    });
});

orchestrator(previewAction, () => {
    const firstInvalidQuestionIndex = getFirstInvalidQuestionIndex(getStore().questions);
    const isValid: boolean = isSurveyValid(firstInvalidQuestionIndex);
    if (isValid) {
        initializeExternal(getActionInstance(), null);
        setValidationMode(false);
        goToPage(Page.Preview);
    } else {
        announceValidationError(firstInvalidQuestionIndex);
        updateActiveQuestionIndex(firstInvalidQuestionIndex);
    }
});


let getActionInstance = (): ActionSDK.ActionInstance => {
    let actionInstance: ActionSDK.ActionInstance = {
        title: getStore().title,
        expiry: getStore().settings.dueDate,
        columns: toJS(getStore().questions),
        properties: []
    };

    if (getStore().settings.resultVisibility === ResultVisibility.Sender) {
        actionInstance.rowsVisibility = ActionSDK.Visibility.Sender;
    } else {
        actionInstance.rowsVisibility = ActionSDK.Visibility.All;
    }
    actionInstance.notificationSettings = [];

    var notificationSettingsMode: ActionSDK.NotificationSettingMode;
    switch (getStore().settings.notificationSettings.mode) {
        case NotificationSettingMode.Daily:
            notificationSettingsMode = ActionSDK.NotificationSettingMode.Daily;
            break;
        case NotificationSettingMode.None:
            notificationSettingsMode = ActionSDK.NotificationSettingMode.None;
            break;
        case NotificationSettingMode.OnRowCreate:
            notificationSettingsMode = ActionSDK.NotificationSettingMode.OnRowCreate;
            break;
        case NotificationSettingMode.OnRowUpdate:
            notificationSettingsMode = ActionSDK.NotificationSettingMode.OnRowUpdate;
            break;
        default:
            notificationSettingsMode = ActionSDK.NotificationSettingMode.None;
    }
    actionInstance.notificationSettings.push({
        mode: notificationSettingsMode,
        time: getStore().settings.notificationSettings.time
    });

    actionInstance.canUserAddMultipleRows = getStore().settings.isMultiResponseAllowed;

    actionInstance.isAnonymous = getStore().settings.isResponseAnonymous;

    const coverImageData = getStore().coverImageData;
    if (coverImageData) {
        let coverImageProperty: ActionSDK.ActionInstanceProperty = {
            name: COVER_IMAGE_PROP_KEY,
            type: ActionSDK.ActionInstancePropertyType.AttachmentList,
            value: ActionSDK.Utils.stringifyJson([coverImageData.coverImage])
        };
        actionInstance.properties.push(coverImageProperty);
    }

    return actionInstance;
}

orchestrator(initializeNavBarButtons, () => {
    if (!UxUtils.renderingForMobile()) {
        return;
    }
    let shouldShowNext: boolean = false;
    if (!ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings)) {
        shouldShowNext = getStore().context.ecsSettings.ShouldSendBotMessagePreview;
    }
    if (getStore().currentPage == Page.Main) {
        let previewMenuItem: ActionSDK.NavBarMenuItem = {
            title: ActionSDK.Localizer.getString("Preview"),
            enabled: true,
            id: "preview"
        };
        ActionSDK.APIs.setNavBarMenuItems([previewMenuItem], (id: string) => {
            navBarMenuCallback(id);
        });
    } else if (getStore().currentPage == Page.Preview) {
        let sendMenuItem: ActionSDK.NavBarMenuItem = {
            title: shouldShowNext ? ActionSDK.Localizer.getString("Next") : ActionSDK.Localizer.getString("SendSurvey"),
            enabled: !getStore().isSendActionInProgress,
            id: "send"
        };
        ActionSDK.APIs.setNavBarMenuItems([sendMenuItem], (id: string) => {
            navBarMenuCallback(id);
        });
    } else {
        ActionSDK.APIs.setNavBarMenuItems([], null);
    }
});

function navBarMenuCallback(id: string) {
    if (!UxUtils.renderingForMobile()) {
        return;
    }
    if (id == "send") {
        if (areAllQuestionsOptional(getStore().questions)) {
            setSendSurveyAlertOpen(true);
        } else {
            sendAction();
        }
    } else if (id == "preview") {
        previewAction();
    }
}

orchestrator(getTeamsGroupAndChannels, () => {

    setTeamsGroupInitializationState(InitializationState.NotInitialized);
    ActionSDK.APIs.getJoinedTeams()
        .then((teamsGroups: ActionSDK.TeamsGroup[]) => {
            let teamIdToTeamObjectMap: Map<string, ActionSDK.TeamsGroup> = new Map<string, ActionSDK.TeamsGroup>();
            let listOfJoinedTeams: Array<string> = new Array<string>();

            for (let teamsGroup of teamsGroups) {

                let groupObj: ActionSDK.TeamsGroup = teamsGroup as ActionSDK.TeamsGroup;
                teamIdToTeamObjectMap.set(groupObj.id, groupObj);
                listOfJoinedTeams.push(groupObj.id);
            }

            ActionSDK.APIs.getListOfChannelsForGroups(listOfJoinedTeams)
                .then((response: ActionSDK.GetChannelsForTeamsResponse) => {
                    for (let entry of Object.entries(response.teamIdToChannelDataMap)) {
                        teamIdToTeamObjectMap.get(entry[0]).channelList = entry[1];
                    }
                    updateTeamsGroupAndChannels(InitializationState.Initialized, Array.from(teamIdToTeamObjectMap.values()));
                })
                .catch(error => {
                    console.log("Error in getChannels :" + JSON.stringify(error));
                    updateTeamsGroupAndChannels(InitializationState.Failed, null);
                });
        })
        .catch(error => {
            console.log("Error in getTeamsGroupAndChannels :" + JSON.stringify(error));
            updateTeamsGroupAndChannels(InitializationState.Failed, null);
        });

});

orchestrator(sendActionForPersonalApp, (msg) => {
    let actionInstance = getActionInstance();
    if (getStore().draftActionInstanceId == "") {
        ActionSDK.ActionUtils.prepareActionInstance(actionInstance, toJS(getStore().context));
        actionInstance.conversationInfo.id = msg.channelId;
        actionInstance.conversationInfo.aadObjectId = msg.teamsId;
        actionInstance.conversationInfo.parentId = getGeneralChannelIdForGroup(msg.teamsId, getStore().teamsGroups);

        /* These changes are for ignite survey personal app demo, need to remove this after ignite demo
        */
        if (getStore().context.tenantId == "60bcdb18-3e8b-4c8d-8e03-c9bd0a442378") {
            actionInstance.conversationInfo.ServiceUrl = "https://smba.trafficmanager.net/amer/";
        }

        ActionSDK.APIs.createActionInstanceNoBot(actionInstance)
            .then((success: boolean) => {
                if (success) {
                    actionInstance.status = ActionSDK.ActionInstanceStatus.Active;
                    msg.callback(actionInstance, null);
                }
            })
            .catch(error => {
                ActionSDK.Logger.logError("sendActionForPersonalApp", "Error in updating draft survey :" + JSON.stringify(error));
                msg.callback(null, error);
            });
    }
    else {
        actionInstance.id = getStore().draftActionInstanceId;
        let conversationInfo: ActionSDK.ConversationInfo = {
            source: getStore().context.hostType,
            id: msg.channelId,
            aadObjectId: msg.teamsId,
            parentId: getGeneralChannelIdForGroup(msg.teamsId, getStore().teamsGroups),
            tenantId: getStore().context.tenantId
        };
        actionInstance.conversationInfo = conversationInfo;


        /* These changes are for ignite survey personal app demo, need to remove this after ignite demo
        */
        if (getStore().context.tenantId == "60bcdb18-3e8b-4c8d-8e03-c9bd0a442378") {
            actionInstance.conversationInfo.ServiceUrl = "https://smba.trafficmanager.net/amer/";
        }

        actionInstance.status = ActionSDK.ActionInstanceStatus.Draft;
        ActionSDK.ActionUtils.prepareActionInstance(actionInstance, toJS(getStore().context));
        ActionSDK.APIs.saveActionInstanceDraft(actionInstance)
            .then(() => {
                ActionSDK.APIs.promoteDraftToAction(actionInstance.id)
                    .then(() => {
                        actionInstance.status = ActionSDK.ActionInstanceStatus.Active;
                        msg.callback(actionInstance, null);
                    })
                    .catch(error => {
                        ActionSDK.Logger.logError("promoteDraftToAction", "Error in promoteDraftToAction :" + JSON.stringify(error));
                        msg.callback(actionInstance, error);
                    });
            })
            .catch(error => {
                console.log("Error in createDraftSurvey :" + JSON.stringify(error));
                ActionSDK.Logger.logError("promoteDraftToAction", "Error in saveActionInstanceDraft :" + JSON.stringify(error));
                msg.callback(null, error);
            });
    }
});

orchestrator(validateAndSend, () => {
    const firstInvalidQuestionIndex = getFirstInvalidQuestionIndex(getStore().questions);
    const isValid: boolean = isSurveyValid(firstInvalidQuestionIndex);
    if (isValid) {
        if (areAllQuestionsOptional(getStore().questions)) {
            setSendSurveyAlertOpen(true);
        } else {
            sendAction();
        }
    } else {
        if (!UxUtils.renderingForMobile()) {
            setShouldFocusOnError(true);
        }
        announceValidationError(firstInvalidQuestionIndex);
        updateActiveQuestionIndex(firstInvalidQuestionIndex);
    }
})

function sendActionInstance() {
    let actionInstance = getActionInstance();
    ActionSDK.ActionUtils.prepareActionInstance(actionInstance, toJS(getStore().context));
    let data = CreateViewData(actionInstance);
    ActionSDK.APIs.createActionInstance(actionInstance, data);
}

function isSurveyValid(firstInvalidQuestionIndex: number) {
    setValidationMode(true);
    if (!isEmptyOrNull(getStore().title) && getStore().questions.length > 0 && firstInvalidQuestionIndex === -1) {
        return true;
    }
    return false;
}

function announceValidationError(invalidQuestionIndex: number) {
    const errorCount = countErrorsPresent(getStore().title, invalidQuestionIndex, getStore().questions);
    if (errorCount > 1) {
        ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("MultipleRequiredError", errorCount));
    } else {
        ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("OneRequiredError"));
    }
}

function CreateViewData(actionInstance: ActionSDK.ActionInstance) {
    let questions: string[] = new Array();
    let columns: ActionInstanceColumn[] = getStore().questions;
    columns.forEach(column => {
        let question: string;
        question = column.title.replace("~", "\\~");
        if (column.isOptional) {
            question = question + "~1";
        } else {
            question = question + "~0";
        }
        // Adding question display type
        let customProperties = JSON.parse(column.customProperties);
        question = question.concat(`~${customProperties["dt"]}`);
        question = question.concat(`~${column.type.toString()}`);
        column.options.forEach(option => {
            question = question + `~${option.title.replace("~", "\\~")}`;
        });
        if (questions != null)
            questions.push(question);
    });

    let surveyData: SurveyViewData = {
        ti: getStore().title,
        et: getStore().settings.dueDate,
        ia: actionInstance.isAnonymous ? 1 : 0,
        cl: questions,
        ns: `${actionInstance.notificationSettings[0].mode}~${actionInstance.notificationSettings[0].time}`,
        rv: getStore().settings.resultVisibility == ResultVisibility.All ? 1 : 0,
        mr: getStore().settings.isMultiResponseAllowed ? 1 : 0
    };
    return surveyData;
}