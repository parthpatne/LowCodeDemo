import { createStore, action } from 'satcheljs';
import '../../mutator/ResponseMutator';
import '../../orchestrators/ResponseOrchestrators';
import * as ActionSDK from "@actionSDK";
import { InitializationState } from '@sharedUI';

export enum ResponsePageViewType {
    Main,
    SelectedResponseView,
    MyResponses
}

export enum ResponseViewMode {
    CreationPreview,
    NewResponse,
    UpdateResponse,
    DisabledResponse
}

interface ISurveyResponseStore {
    context: ActionSDK.ActionContext;
    actionInstance: ActionSDK.ActionInstance;
    response: {
        id: string;
        row: {}
    };
    savedActionInstanceRow: {};
    isValidationModeOn: boolean;
    isInitialized: InitializationState;
    isSendActionInProgress: boolean;
    currentView: ResponsePageViewType;
    myResponses: ActionSDK.ActionInstanceRow[];
    currentResponseIndex: number;
    responseViewMode: ResponseViewMode;
    responseSubmissionFailed: boolean;
    topMostErrorIndex: number;
    isActionDeleted: boolean;
}

const store: ISurveyResponseStore = {
    context: null,
    actionInstance: null,
    response: {
        id: null,
        row: {}
    },
    savedActionInstanceRow: {},
    isValidationModeOn: false,
    isInitialized: InitializationState.NotInitialized,
    isSendActionInProgress: false,
    currentView: ResponsePageViewType.Main,
    myResponses: [],
    currentResponseIndex: -1,
    responseViewMode: ResponseViewMode.NewResponse,
    responseSubmissionFailed: false,
    topMostErrorIndex: -1,
    isActionDeleted: false
}

export default createStore<ISurveyResponseStore>('responseStore', store);
