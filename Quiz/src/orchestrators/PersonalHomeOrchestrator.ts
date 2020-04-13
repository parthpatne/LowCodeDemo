import { orchestrator } from "satcheljs";
import {
    initialize,
    setAppInitialized,
    createDraftSurvey,
    addOrUpdateActionInstanceInStore,
    updateDraftSurvey,
    initializeExternalActionInstance,
    setSummaryPageContext,
    updateSurvey,
    setCreationPersonalAppMode,
    setSummaryPersonalAppMode,
    getActionInstanceSummary,
    updateActionInstanceSummary,
    closeSurvey
} from "../actions/PersonalHomeActions";
import { InitializationState } from "@sharedUI";
import * as ActionSDK from "@actionSDK";
import getStore from "../store/personalApp/Store";
import { toJS } from "mobx";
import { initializeExternal, openCreationInPersonalAppMode } from "../actions/CreationActions";
import { setContext, openSummaryInPersonalAppMode } from "../actions/SummaryActions";



orchestrator(initialize, () => {
    ActionSDK.Localizer.initialize()
        .then(() => {
            ActionSDK.APIs.getJoinedTeams()
                .then((teamsGroups: ActionSDK.TeamsGroup[]) => {
                    let teamIdToTeamsGroupMap: { [key: string]: ActionSDK.TeamsGroup } = {};
                    let listOfJoinedTeams: Array<string> = new Array<string>();

                    for (let teamsGroup of teamsGroups) {

                        let groupObj: ActionSDK.TeamsGroup = teamsGroup as ActionSDK.TeamsGroup;
                        teamIdToTeamsGroupMap[groupObj.id] = groupObj;
                        listOfJoinedTeams.push(groupObj.id);
                    }

                    ActionSDK.APIs.getListOfChannelsForGroups(listOfJoinedTeams)
                        .then((response: ActionSDK.GetChannelsForTeamsResponse) => {
                            for (let entry of Object.entries(response.teamIdToChannelDataMap)) {
                                teamIdToTeamsGroupMap[entry[0]].channelList = entry[1];
                            }
                            let filteredActionInstanceRequest: ActionSDK.FilteredActionInstanceRequest = {
                                batchSize: 0,
                                filters: "",
                                cntToken: ""
                            }
                            var promises: Promise<any>[] = [];
                            promises.push(ActionSDK.APIs.getCurrentContext());
                            promises.push(ActionSDK.APIs.getTemplateActions(filteredActionInstanceRequest));
                            promises.push(ActionSDK.APIs.getActionInstances(filteredActionInstanceRequest));
                            promises.push(ActionSDK.APIs.getDraftActionInstances(filteredActionInstanceRequest));
                            Promise.all(promises).then((results: any[]) => {
                                setAppInitialized(InitializationState.Initialized, results[0], results[1], results[2], results[3], teamIdToTeamsGroupMap);
                            }).catch((error: ActionSDK.ActionError) => {
                                setAppInitialized(InitializationState.Failed, null, null, null, null, null);
                            });
                        })
                        .catch(error => {
                            ActionSDK.Logger.logError("SurveyCreationInitialize", "Error in getting teams group" + JSON.stringify(error));
                            setAppInitialized(InitializationState.Failed, null, null, null, null, null);
                        });
                })
                .catch(error => {
                    ActionSDK.Logger.logError("SurveyCreationInitialize", "Error in getting teams channel" + JSON.stringify(error));
                    setAppInitialized(InitializationState.Failed, null, null, null, null, null);
                });
        })
        .catch(error => {
            ActionSDK.Logger.logError("SurveyCreationInitialize", "Error in getting localized strings :" + JSON.stringify(error));
            setAppInitialized(InitializationState.Failed, null, null, null, null, null);
        });
});

orchestrator(createDraftSurvey, (msg) => {

    let actionInstance: ActionSDK.ActionInstance = msg.newDraftSurvey;
    actionInstance.id = "";
    let updatedContext: ActionSDK.ActionContext = toJS(getStore().context);
    updatedContext.conversationInfo = {
        source: updatedContext.hostType,
        id: "",
        aadObjectId: "",
        tenantId: updatedContext.tenantId
    }
    actionInstance.status = ActionSDK.ActionInstanceStatus.Draft;
    ActionSDK.ActionUtils.prepareActionInstance(actionInstance, updatedContext);

    ActionSDK.APIs.saveActionInstanceDraft(actionInstance)
        .then((success: boolean) => {
            addOrUpdateActionInstanceInStore(actionInstance);
        })
        .catch(error => {
            ActionSDK.Logger.logError("createDraftSurvey", "Error in createDraftSurvey :" + JSON.stringify(error));
        });
});

orchestrator(updateDraftSurvey, (msg) => {
    let updatedContext: ActionSDK.ActionContext = toJS(getStore().context);
    let actionInstance: ActionSDK.ActionInstance = msg.updatedDraftSurvey;
    ActionSDK.ActionUtils.prepareActionInstance(actionInstance, updatedContext);

    ActionSDK.APIs.updateActionInstanceDraft(actionInstance)
        .then((success: boolean) => {
            if (success) {
                let actionInstance = msg.updatedDraftSurvey as ActionSDK.ActionInstance;
                actionInstance.updateTime = Date.now();
                addOrUpdateActionInstanceInStore(actionInstance);
            }
        })
        .catch(error => {
            ActionSDK.Logger.logError("updateDraftSurvey", "Error in updateeDraftSurvey :" + JSON.stringify(error));
        });
});

orchestrator(updateSurvey, (msg) => {
    let actionInstance: ActionSDK.ActionInstance = msg.actionInstance;
    addOrUpdateActionInstanceInStore(actionInstance);
});

orchestrator(initializeExternalActionInstance, (msg) => {
    initializeExternal(msg.survey);
});

orchestrator(setSummaryPageContext, (msg) => {
    setContext(msg.context);
});

orchestrator(setCreationPersonalAppMode, (msg) => {
    openCreationInPersonalAppMode();
});

orchestrator(setSummaryPersonalAppMode, (msg) => {
    openSummaryInPersonalAppMode();
});

orchestrator(getActionInstanceSummary, (msg) => {
    ActionSDK.APIs.getActionInstanceSummary(msg.actionInstanceId)
        .then((actionInstanceSummary: ActionSDK.ActionInstanceSummary) => {
            updateActionInstanceSummary(msg.actionInstanceId, actionInstanceSummary);
        })
        .catch(error => {
            ActionSDK.Logger.logError("getActionInstanceSummary", "Error in getActionInstanceSummary :" + JSON.stringify(error));
            updateActionInstanceSummary(msg.actionInstanceId, null);
        });
});

orchestrator(closeSurvey, (msg) => {
    var actionInstanceUpdateInfo: ActionSDK.ActionInstanceUpdateInfo = {
        version: msg.actionInstance.version,
        status: ActionSDK.ActionInstanceStatus.Closed
    };
    msg.actionInstance.status = ActionSDK.ActionInstanceStatus.Closed;
    ActionSDK.APIs.updateActionInstance(msg.actionInstance.id, actionInstanceUpdateInfo)
        .then((success: boolean) => {
            if (success) {
                addOrUpdateActionInstanceInStore(msg.actionInstance)
            } else {
                ActionSDK.Logger.logError("closeSurvey", `closeSurvey failed, Error: not success`);
            }
        })
        .catch((error: ActionSDK.ActionError) => {
            ActionSDK.Logger.logError("closeSurvey", "Error in closeSurvey :" + JSON.stringify(error));
        });
});