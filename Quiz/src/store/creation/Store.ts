import { createStore } from 'satcheljs';
import { ResultVisibility, NotificationSettings, NotificationSettingMode, ISettingsComponentProps, InitializationState, Constants } from "@sharedUI"
import '../../orchestrators/CreationOrchestrators';
import '../../mutator/CreationMutator';
import * as ActionSDK from "@actionSDK";

export enum Page {
    Main,
    Settings,
    Preview,
    UpdateQuestion
}

interface ISurveyCreationStore {
    context: ActionSDK.ActionContext;
    title: string;
    preview: boolean;
    questions: ActionSDK.ActionInstanceColumn[];
    settings: ISettingsComponentProps;
    activeQuestionIndex: number;
    isValidationModeOn: boolean;
    isInitialized: InitializationState;
    initPending: boolean;
    currentPage: Page;
    previousPage: Page;
    isSendActionInProgress: boolean;
    coverImageData: { coverImage: ActionSDK.Attachment, uploadStatus: ActionSDK.AttachmentStatus, uploadPromise: Promise<string> };
    inPersonalAppMode: boolean;
    teamsGroups: ActionSDK.TeamsGroup[];
    teamsGroupInitialized: InitializationState;
    draftActionInstanceId: string;
    openChannelPickerDialog: boolean;
    openSettingDialog: boolean;
    teamIdToTeamGroupMap: Map<string, ActionSDK.TeamsGroup>;
    isSendSurveyAlertOpen: boolean;
    shouldFocusOnError: boolean;
}

const store: ISurveyCreationStore = {
    context: null,
    title: "",
    preview: false,
    questions: [],
    settings: {
        resultVisibility: ResultVisibility.All,
        dueDate: ActionSDK.Utils.getDefaultExpiry(7).getTime(),
        notificationSettings: new NotificationSettings(NotificationSettingMode.Daily, Constants.DEFAULT_DAILY_NOTIFICATION_TIME),
        isResponseEditable: true,
        isResponseAnonymous: false,
        isMultiResponseAllowed: false,
        strings: null
    },
    activeQuestionIndex: -1,
    isValidationModeOn: false,
    isInitialized: InitializationState.NotInitialized,
    initPending: true,
    currentPage: Page.Main,
    previousPage: Page.Main,
    isSendActionInProgress: false,
    coverImageData: undefined,
    inPersonalAppMode: false,
    teamsGroups: new Array<ActionSDK.TeamsGroup>(),
    teamsGroupInitialized: InitializationState.NotInitialized,
    draftActionInstanceId: "",
    openChannelPickerDialog: false,
    openSettingDialog: false,
    teamIdToTeamGroupMap: new Map<string, ActionSDK.TeamsGroup>(),
    isSendSurveyAlertOpen: false,
    shouldFocusOnError: false
}

export default createStore<ISurveyCreationStore>('store', store);
