import { createStore } from 'satcheljs';
import { InitializationState } from "@sharedUI"
import '../../orchestrators/PersonalHomeOrchestrator';
import '../../mutator/PersonalHomeMutator';
import * as ActionSDK from "@actionSDK";

export enum Page {
    Home,
    Creation,
    Summary
}

interface IPersonalAppStore {

    isInitialized: InitializationState;
    currentPage: Page;
    templateSurveyMap: { [key: string]: ActionSDK.ActionInstance };
    otherSurveyMap: { [key: string]: ActionSDK.ActionInstance };
    sortedTemplatePageMap: { [key: string]: ActionSDK.ActionInstance[] };
    sortedActionInstanceArray: ActionSDK.ActionInstance[];
    templateContinuationToken: string;
    actionInstanceContinuationToken: string;
    initPending: boolean;
    context: ActionSDK.ActionContext;
    draftContinuationToken: string;
    actionInstanceResponseInitializationMap: Map<string, InitializationState>;
    actionIdActionSummaryMap: { [key: string]: ActionSDK.ActionInstanceSummary };
    teamIdToTeamsGroupMap: { [key: string]: ActionSDK.TeamsGroup };
}

const store: IPersonalAppStore = {
    isInitialized: InitializationState.NotInitialized,
    currentPage: Page.Home,
    templateSurveyMap: {},
    otherSurveyMap: {},
    sortedTemplatePageMap: {},
    sortedActionInstanceArray: new Array<ActionSDK.ActionInstance>(),
    templateContinuationToken: "",
    actionInstanceContinuationToken: "",
    context: null,
    initPending: true,
    draftContinuationToken: "",
    actionInstanceResponseInitializationMap: new Map<string, InitializationState>(),
    actionIdActionSummaryMap: {},
    teamIdToTeamsGroupMap: {}
}

export default createStore<IPersonalAppStore>('personalAppStore', store);
