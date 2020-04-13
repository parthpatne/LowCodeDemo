import { action } from "satcheljs";
import { SummaryPageViewType, SummaryProgressStatus, ResponsesListViewType, QuestionDrillDownInfo } from "../store/summary/Store";
import * as ActionSDK from "@actionSDK";

enum SurveySummaryAction {
    initialize = "initialize",
    setContext = "setContext",
    updateActionInstance = "updateActionInstance",
    setDueDate = "setDueDate",
    updateSummary = "updateSummary",
    setCurrentView = "setCurrentView",
    showMoreOptions = "showMoreOptions",
    actionInstanceRow = "actionInstanceRow",
    surveyCloseAlertOpen = "surveyCloseAlertOpen",
    surveyExpiryChangeAlertOpen = "surveyExpiryChangeAlertOpen",
    actionInstanceSendReminder = "actionInstanceSendReminder",
    surveyDeleteAlertOpen = "surveyDeleteAlertOpen",
    updateNonResponders = "updateNonResponders",
    updateMemberCount = "updateMemberCount",
    updateProfilePhotos = "updateProfilePhotos",
    updateUserProfileInfo = "updateUserProfileInfo",
    updateUserProfilePic = "updateUserProfilePic",
    updateMyRows = "updateMyRows",
    setProgressStatus = "setProgressStatus",
    goBack = "goBack",
    fetchActionInstance = "fetchActionInstance",
    fetchUserDetails = "fetchUserDetails",
    fetchUserProfilePic = "fetchUserProfilePic",
    actionInstanceSummary = "actionInstanceSummary",
    fetchActionInstanceRows = "fetchActionInstanceRows",
    fetchNonResponders = "fetchNonResponders",
    updateDueDate = "updateDueDate",
    closeSurvey = "closeSurvey",
    deleteSurvey = "deleteSurvey",
    updateContinuationToken = "updateContinuationToken",
    downloadCSV = "downloadCSV",
    fetchLocalization = "fetchLocalization",
    fetchMyResponse = "fetchMyResponse",
    fetchMemberCount = "fetchMemberCount",
    addLog = "addLog",
    updateCurrentResponseIndex = "updateCurrentResponseIndex",
    showResponseView = "showResponseView",
    setResponseViewType = "setResponseViewType",
    openSummaryInPersonalAppMode = "openSummaryInPersonalAppMode",
    setSelectedQuestionDrillDownInfo = "setSelectedQuestionDrillDownInfo",
    setIsActionDeleted = "setIsActionDeleted"
}

export let initialize = action(SurveySummaryAction.initialize);

export let setContext = action(SurveySummaryAction.setContext, (context: ActionSDK.ActionContext) => ({
    context: context
}));

export let fetchUserDetails = action(SurveySummaryAction.fetchUserDetails, (userIds: string[]) => ({
    userIds: userIds
}));

export let fetchUserProfilePic = action(SurveySummaryAction.fetchUserProfilePic, (userIds: string[]) => ({
    userIds: userIds
}));

export let fetchActionInstance = action(SurveySummaryAction.fetchActionInstance, ((updateState: boolean) => ({ updateState: updateState })));

export let fetchLocalization = action(SurveySummaryAction.fetchLocalization);

export let fetchMyResponse = action(SurveySummaryAction.fetchMyResponse);

export let fetchMemberCount = action(SurveySummaryAction.fetchMemberCount);

export let fetchActionInstanceSummary = action(SurveySummaryAction.actionInstanceSummary);

export let fetchActionInstanceRows = action(SurveySummaryAction.fetchActionInstanceRows);

export let fetchNonResponders = action(SurveySummaryAction.fetchNonResponders);

export let updateDueDate = action(SurveySummaryAction.updateDueDate, (dueDate: number) => ({
    dueDate: dueDate
}));

export let closeSurvey = action(SurveySummaryAction.closeSurvey);

export let deleteSurvey = action(SurveySummaryAction.deleteSurvey);

export let downloadCSV = action(SurveySummaryAction.downloadCSV);

export let addLog = action(SurveySummaryAction.addLog, (loglevel: ActionSDK.LogLevel, message: any) => ({
    loglevel: loglevel,
    message: message
}));

export let setProgressStatus = action(SurveySummaryAction.setProgressStatus, (status: Partial<SummaryProgressStatus>) => ({
    status: status
}));

export let updateActionInstance = action(SurveySummaryAction.updateActionInstance, (actionInstance: ActionSDK.ActionInstance) => ({
    actionInstance: actionInstance
}));

export let updateMyRows = action(SurveySummaryAction.updateMyRows, (rows: ActionSDK.ActionInstanceRow[]) => ({
    rows: rows
}));

export let setDueDate = action(SurveySummaryAction.setDueDate, (date: number) => ({
    date: date
}));

export let showMoreOptions = action(SurveySummaryAction.showMoreOptions, (showMoreOptions: boolean) => ({
    showMoreOptions: showMoreOptions
}));

export let setCurrentView = action(SurveySummaryAction.setCurrentView, (view: SummaryPageViewType) => ({
    view: view
}));

export let surveyCloseAlertOpen = action(SurveySummaryAction.surveyCloseAlertOpen, (open: boolean) => ({
    open: open
}));

export let surveyExpiryChangeAlertOpen = action(SurveySummaryAction.surveyExpiryChangeAlertOpen, (open: boolean) => ({
    open: open
}));

export let actionInstanceSendReminder = action(SurveySummaryAction.actionInstanceSendReminder);

export let surveyDeleteAlertOpen = action(SurveySummaryAction.surveyDeleteAlertOpen, (open: boolean) => ({
    open: open
}));

export let addActionInstanceRows = action(SurveySummaryAction.actionInstanceRow, (rows: ActionSDK.ActionInstanceRow[]) => ({
    rows: rows
}));

export let updateSummary = action(SurveySummaryAction.updateSummary, (actionInstanceSummary: ActionSDK.ActionInstanceSummary) => ({
    actionInstanceSummary: actionInstanceSummary
}));

export let updateUserProfileMap = action(SurveySummaryAction.updateUserProfileInfo, (userProfileMap: {}) => ({
    userProfileMap: userProfileMap
}));

export let goBack = action(SurveySummaryAction.goBack);

export let updateNonResponders = action(SurveySummaryAction.updateNonResponders, (nonResponder: ActionSDK.NonResponder) => ({
    nonResponder: nonResponder
}));

export let updateMemberCount = action(SurveySummaryAction.updateMemberCount, (memberCount: ActionSDK.MemberCount) => ({
    memberCount: memberCount
}));

export let updateCurrentResponseIndex = action(SurveySummaryAction.updateCurrentResponseIndex, (index: number) => ({
    index: index
}));

export let updateUserProfilePic = action(SurveySummaryAction.updateUserProfilePic, (userProfilePicMap: { [key: string]: ActionSDK.Base64ProfilePhoto }) => ({
    userProfilePicMap: userProfilePicMap
}));

export let updateContinuationToken = action(SurveySummaryAction.updateContinuationToken, (token: string) => ({
    token: token
}));

export let showResponseView = action(SurveySummaryAction.showResponseView, (index: number, responses: ActionSDK.ActionInstanceRow[]) => ({
    index: index,
    responses: responses
}));

export let setResponseViewType = action(SurveySummaryAction.setResponseViewType, (responseViewType: ResponsesListViewType) => ({
    responseViewType: responseViewType
}));

export let openSummaryInPersonalAppMode = action(SurveySummaryAction.openSummaryInPersonalAppMode);

export let setSelectedQuestionDrillDownInfo = action(SurveySummaryAction.setSelectedQuestionDrillDownInfo, (questionDrillDownInfo: QuestionDrillDownInfo) => ({
    questionDrillDownInfo: questionDrillDownInfo
}))

export let setIsActionDeleted = action(SurveySummaryAction.setIsActionDeleted, (isActionDeleted: boolean) => ({
    isActionDeleted: isActionDeleted
}));
