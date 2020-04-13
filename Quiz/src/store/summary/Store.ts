import { createStore } from 'satcheljs';
import "../../orchestrators/SummaryOrchestrator";
import "../../mutator/SummaryMutator";
import * as ActionSDK from "@actionSDK";
import { ProgressState } from '@sharedUI';
import { QuestionDisplayType } from '../../common/QuestionDisplayType';

export enum SummaryPageViewType {
    Main,
    ResponderView,
    NonResponderView,
    ResponseView,
    ResponseAggregationView
}

export enum ResponsesListViewType {
    AllResponses,
    MyResponses
}

export interface QuestionDrillDownInfo {
    id: number;
    title: string;
    type: ActionSDK.ActionInstanceColumnType;
    responseCount: number;
    displayType: QuestionDisplayType;
    choiceIndex?: number;
    subTitle?: string;
}

export interface SummaryProgressStatus {
    actionInstance: ProgressState;
    memberCount: ProgressState;
    nonResponder: ProgressState;
    actionSummary: ProgressState;
    localizationState: ProgressState;
    actionInstanceRow: ProgressState;
    myActionInstanceRow: ProgressState;
    downloadData: ProgressState;
    closeActionInstance: ProgressState;
    deleteActionInstance: ProgressState;
    updateActionInstance: ProgressState;
    currentContext: ProgressState;
    reminder: ProgressState;
}

interface ISurveySummaryStore {
    context: ActionSDK.ActionContext;
    actionInstance: ActionSDK.ActionInstance;
    actionSummary: ActionSDK.ActionInstanceSummary;
    dueDate: number;
    currentView: SummaryPageViewType;
    continuationToken: string;
    actionInstanceRows: ActionSDK.ActionInstanceRow[];
    myRows: ActionSDK.ActionInstanceRow[];
    userProfile: { [key: string]: ActionSDK.UserProfile };
    nonResponders: ActionSDK.NonResponder;
    memberCount: ActionSDK.MemberCount;
    showMoreOptionsList: boolean;
    isSurveyCloseAlertOpen: boolean;
    isChangeExpiryAlertOpen: boolean;
    isDeleteSurveyAlertOpen: boolean;
    isReminderAlertOpen: boolean;
    progressStatus: SummaryProgressStatus;
    currentResponseIndex: number;
    responseViewType: ResponsesListViewType;
    inPersonalAppMode: boolean;
    selectedQuestionDrillDownInfo: QuestionDrillDownInfo;
    isActionDeleted: boolean;
}

const store: ISurveySummaryStore = {
    context: null,
    actionInstance: null,
    actionSummary: null,
    myRows: [],
    dueDate: ActionSDK.Utils.getDefaultExpiry(7).getTime(),
    currentView: SummaryPageViewType.Main,
    actionInstanceRows: [],
    continuationToken: null,
    showMoreOptionsList: false,
    isSurveyCloseAlertOpen: false,
    isChangeExpiryAlertOpen: false,
    isDeleteSurveyAlertOpen: false,
    isReminderAlertOpen: false,
    userProfile: {},
    nonResponders: null,
    memberCount: null,
    progressStatus: {
        actionInstance: ProgressState.NotStarted,
        actionSummary: ProgressState.NotStarted,
        memberCount: ProgressState.NotStarted,
        nonResponder: ProgressState.NotStarted,
        localizationState: ProgressState.NotStarted,
        actionInstanceRow: ProgressState.NotStarted,
        myActionInstanceRow: ProgressState.NotStarted,
        downloadData: ProgressState.NotStarted,
        closeActionInstance: ProgressState.NotStarted,
        deleteActionInstance: ProgressState.NotStarted,
        updateActionInstance: ProgressState.NotStarted,
        currentContext: ProgressState.NotStarted,
        reminder: ProgressState.NotStarted
    },
    currentResponseIndex: -1,
    responseViewType: ResponsesListViewType.AllResponses,
    inPersonalAppMode: false,
    selectedQuestionDrillDownInfo: {
        id: -1,
        title: "",
        type: ActionSDK.ActionInstanceColumnType.Text,
        responseCount: 0,
        displayType: -1
    },
    isActionDeleted: false
}

export default createStore<ISurveySummaryStore>('summaryStore', store);
