import { action } from "satcheljs";
import * as ActionSDK from "@actionSDK";
import { InitializationState } from "SharedUI/src/common";
import { Page } from "../store/personalApp/Store";

export enum PersonalHomePageAction {
    initialize = "initialize",
    goToPage = "goToPage"
}

export enum SurveyPersonalHomeAction {
    initialize = "initialize",
    goToPage = "goToPage",
    setAppInitialized = "setAppInitialized",
    getAllUserSurvey = "getSurveyList",
    getAllTemplateSurvey = "getAllTemplateSurvey",
    createDraftSurvey = "createDraftAction",
    updateDraftSurvey = "updateDraftAction",
    addOrUpdateActionInstanceInStore = "addOrUpdateActionInstanceInStore",
    deleteActionInstanceInStore = "deleteActionInstanceInStore",
    initializeExternalActionInstance = "initializeExternalActionInstance",
    setSummaryPageContext = "setSummaryPageContext",
    setCreationPersonalAppMode = "setCreationPersonalAppMode",
    setSummaryPersonalAppMode = "setSummaryPersonalAppMode",
    updateSurvey = "updateSurvey",
    getActionInstanceSummary = "getActionInstanceSummary",
    updateActionInstanceSummary = "updateActionInstanceSummary",
    closeSurvey = "closeSurveyPersonalApp",
    addLog = "addLog",
}

export let initialize = action(SurveyPersonalHomeAction.initialize);

export let goToPage = action(PersonalHomePageAction.goToPage, (page: Page) => ({ page: page }));

export let setAppInitialized = action(SurveyPersonalHomeAction.setAppInitialized, (state: InitializationState, context: ActionSDK.ActionContext, templateActionResponse: ActionSDK.FilteredTemplateActionInstanceResponse,
    actionInstanceResponse: ActionSDK.FilteredActionInstanceResponse, draftActionInstanceResponse: ActionSDK.FilteredActionInstanceResponse,
    teamIdToTeamsGroupMap: { [key: string]: ActionSDK.TeamsGroup }) => ({
        state: state,
        context: context,
        templateActionResponse: templateActionResponse,
        actionInstanceResponse: actionInstanceResponse,
        draftActionInstanceResponse: draftActionInstanceResponse,
        teamIdToTeamsGroupMap: teamIdToTeamsGroupMap
    }));

export let getAllUserSurvey = action(SurveyPersonalHomeAction.getAllUserSurvey);
export let getAllTemplateSurvey = action(SurveyPersonalHomeAction.getAllTemplateSurvey);

export let createDraftSurvey = action(SurveyPersonalHomeAction.createDraftSurvey, (newDraftSurvey: ActionSDK.ActionInstance) => ({
    newDraftSurvey: newDraftSurvey
}));

export let updateDraftSurvey = action(SurveyPersonalHomeAction.updateDraftSurvey, (updatedDraftSurvey: ActionSDK.ActionInstance) => ({
    updatedDraftSurvey: updatedDraftSurvey
}));

export let addOrUpdateActionInstanceInStore = action(SurveyPersonalHomeAction.addOrUpdateActionInstanceInStore, (updatedSurvey: ActionSDK.ActionInstance) => ({
    updatedSurvey: updatedSurvey
}));

export let deleteActionInstanceInStore = action(SurveyPersonalHomeAction.deleteActionInstanceInStore, (id: string) => ({
    id: id
}));

export let initializeExternalActionInstance = action(SurveyPersonalHomeAction.initializeExternalActionInstance, (survey: ActionSDK.ActionInstance) => ({ survey: survey }));

export let setSummaryPageContext = action(SurveyPersonalHomeAction.setSummaryPageContext, (context: ActionSDK.ActionContext) => ({ context: context }));

export let setCreationPersonalAppMode = action(SurveyPersonalHomeAction.setCreationPersonalAppMode);

export let setSummaryPersonalAppMode = action(SurveyPersonalHomeAction.setSummaryPersonalAppMode);

export let updateSurvey = action(SurveyPersonalHomeAction.updateSurvey, (actionInstance: ActionSDK.ActionInstance) => ({
    actionInstance: actionInstance
}));

export let getActionInstanceSummary = action(SurveyPersonalHomeAction.getActionInstanceSummary, (actionInstanceId: string) => ({
    actionInstanceId: actionInstanceId
}));

export let updateActionInstanceSummary = action(SurveyPersonalHomeAction.updateActionInstanceSummary, (actionInstanceId: string, actionInstanceSummary: ActionSDK.ActionInstanceSummary) => ({
    actionInstanceSummary: actionInstanceSummary,
    actionInstanceId: actionInstanceId
}));

export let addLog = action(SurveyPersonalHomeAction.addLog, (loglevel: ActionSDK.LogLevel, message: any) => ({
    loglevel: loglevel,
    message: message
}));

export let closeSurvey = action(SurveyPersonalHomeAction.closeSurvey, (actionInstance: ActionSDK.ActionInstance) => ({
    actionInstance: actionInstance
}));