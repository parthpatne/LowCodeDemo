import { action } from "satcheljs";
import { QuestionDisplayType } from "../common/QuestionDisplayType";
import { ISettingsComponentProps } from "@sharedUI";
import * as ActionSDK from "@actionSDK";
import { InitializationState } from "SharedUI/src/common";
import { Page } from "../store/creation/Store";

export enum SurveyCreationAction {
    initialize = "initialize",
    setContext = "setContext",
    addQuestion = "addQuestion",
    deleteQuestion = "deleteQuestion",
    updateQuestion = "updateQuestion",
    updateTitle = "updateTitle",
    updateCoverImageData = "updateCoverImageData",
    moveQuestionUp = "moveQuestionUp",
    moveQuestionDown = "moveQuestionDown",
    updateActiveQuestionIndex = "updateActiveQuestionIndex",
    updateSettings = "updateSettings",
    sendAction = "sendAction",
    previewAction = "previewAction",  // To update response view store 
    showPreview = "showPreview", // To show preview screen
    setValidationMode = "setValidationMode",
    setAppInitialized = "setAppInitialized",
    duplicateQuestion = "duplicateQuestion",
    goToPage = "goToPage",
    updateCustomProps = "updateCustomProps",
    setSendingFlag = "setSendingFlag",
    updateChoiceText = "updateChoiceText",
    initializeNavBarButtons = "initializeNavBarButtons",
    showUpdateQuestionPage = "showUpdateQuestionPage",
    initializeExternal = "initializeExternal",
    openCreationInPersonalAppMode = "openCreationInPersonalAppMode",
    setTeamsGroupInitializationState = "setTeamsGroupInitializationState",
    getTeamsGroupAndChannels = "getTeamsGroupAndChannels",
    updateTeamsGroupAndChannels = "updateTeamsGroupAndChannels",
    sendActionForPersonalApp = "sendActionForPersonalApp",
    resetSurveyToDefault = "resetSurveyToDefault",
    setChannelPickerDialogOpen = "setDialogOpen",
    uploadCoverImage = "coverImage",
    setSettingDialogOpen = "setSettingDialogOpen",
    setSendSurveyAlertOpen = "setSendSurveyAlertOpen",
    validateAndSend = "validateAndSend",
    setPreviousPage = "setPreviousPage",
    setShouldFocusOnError = "setShouldFocusOnError"
}

export let sendAction = action(SurveyCreationAction.sendAction);

export let previewAction = action(SurveyCreationAction.previewAction);
export let showPreview = action(SurveyCreationAction.showPreview, (showPreview: boolean) => ({ showPreview: showPreview }));

export let addQuestion = action(SurveyCreationAction.addQuestion, (questionType: ActionSDK.ActionInstanceColumnType, displayType: QuestionDisplayType, customProps?: any, renderingForMobile?: boolean) => ({
    questionType: questionType,
    displayType: displayType,
    customProps: customProps,
    renderingForMobile: renderingForMobile
}));

export let deleteQuestion = action(SurveyCreationAction.deleteQuestion, (index: number) => ({ index: index }));

export let updateSettings = action(SurveyCreationAction.updateSettings, (props: ISettingsComponentProps) => ({
    settingProps: props
}));

export let uploadCoverImage = action(SurveyCreationAction.uploadCoverImage, () => ({

}));

export let updateQuestion = action(SurveyCreationAction.updateQuestion, (index: number, question: ActionSDK.ActionInstanceColumn) => ({
    questionIndex: index,
    question: question
}));

export let moveQuestionUp = action(SurveyCreationAction.moveQuestionUp, (index: number) => ({
    index: index
}));

export let moveQuestionDown = action(SurveyCreationAction.moveQuestionDown, (index: number) => ({
    index: index
}));

export let updateTitle = action(SurveyCreationAction.updateTitle, (text: string) => ({
    value: text
}));

export let updateCoverImageData = action(SurveyCreationAction.updateCoverImageData, (imageObj: ActionSDK.Attachment, sendStatus: ActionSDK.AttachmentStatus, uploadPromise?: Promise<string>) => ({
    coverImage: imageObj,
    sendStatus: sendStatus,
    uploadPromise: uploadPromise
}));

export let updateActiveQuestionIndex = action(SurveyCreationAction.updateActiveQuestionIndex, (index: number) => ({
    activeIndex: index
}));

export let setValidationMode = action(SurveyCreationAction.setValidationMode, (validationMode: boolean) => ({
    validationMode: validationMode
}));

export let initialize = action(SurveyCreationAction.initialize);

export let setContext = action(SurveyCreationAction.setContext, (context: ActionSDK.ActionContext) => ({ context: context }));

export let setAppInitialized = action(SurveyCreationAction.setAppInitialized, (state: InitializationState) => ({ state: state }));

export let duplicateQuestion = action(SurveyCreationAction.duplicateQuestion, (index: number) => ({
    index: index
}));

export let goToPage = action(SurveyCreationAction.goToPage, (page: Page) => ({ page: page }));

export let updateCustomProps = action(SurveyCreationAction.updateCustomProps, (index: number, customProps: any) => ({ index: index, customProps: customProps }));

export let setSendingFlag = action(SurveyCreationAction.setSendingFlag, (value: boolean) => ({ value: value }));


export let updateChoiceText = action(SurveyCreationAction.updateChoiceText, (text: string, choiceIndex: number, questionIndex: number) => ({
    text: text,
    choiceIndex: choiceIndex,
    questionIndex: questionIndex
}));

export let initializeNavBarButtons = action(SurveyCreationAction.initializeNavBarButtons);

export let showUpdateQuestionPage = action(SurveyCreationAction.showUpdateQuestionPage, (questionIndex: number) => ({
    questionIndex: questionIndex
}));

export let initializeExternal = action(SurveyCreationAction.initializeExternal, (actionInstance: ActionSDK.ActionInstance) => ({ actionInstance: actionInstance }));

export let openCreationInPersonalAppMode = action(SurveyCreationAction.openCreationInPersonalAppMode);

export let getTeamsGroupAndChannels = action(SurveyCreationAction.getTeamsGroupAndChannels);

export let setTeamsGroupInitializationState = action(SurveyCreationAction.setTeamsGroupInitializationState, (state: InitializationState) => ({
    state: state
}));

export let updateTeamsGroupAndChannels = action(SurveyCreationAction.updateTeamsGroupAndChannels, (state: InitializationState, teamsGroups: ActionSDK.TeamsGroup[]) => ({
    state: state,
    teamsGroups: teamsGroups
}));

export let sendActionForPersonalApp = action(SurveyCreationAction.sendActionForPersonalApp, (teamsId: string, channelId: string, callback: (actionInstance: ActionSDK.ActionInstance, error: ActionSDK.ActionError) => void) => ({
    teamsId: teamsId,
    channelId: channelId,
    callback: callback
}));

export let resetSurveyToDefault = action(SurveyCreationAction.resetSurveyToDefault);

export let setChannelPickerDialogOpen = action(SurveyCreationAction.setChannelPickerDialogOpen, (dialogOpenIndicator: boolean) => ({
    dialogOpenIndicator: dialogOpenIndicator
}));

export let setSettingDialogOpen = action(SurveyCreationAction.setSettingDialogOpen, (openDialog: boolean) => ({
    openDialog: openDialog
}));

export let setSendSurveyAlertOpen = action(SurveyCreationAction.setSendSurveyAlertOpen, (openDialog: boolean) => ({
    openDialog: openDialog
}));

export let validateAndSend = action(SurveyCreationAction.validateAndSend);

export let setPreviousPage = action(SurveyCreationAction.setPreviousPage, (previousPage: Page) => ({
    previousPage: previousPage
}));

export let setShouldFocusOnError = action(SurveyCreationAction.setShouldFocusOnError, (shouldFocus: boolean) => ({
    value: shouldFocus
}));
