import { ResultVisibility } from '@sharedUI';
import * as ActionSDK from '@actionSDK';
import { toJS } from 'mobx';
import { mutator } from 'satcheljs';

import {
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    goToPage,
    moveQuestionDown,
    moveQuestionUp,
    setAppInitialized,
    setSendingFlag,
    setValidationMode,
    showPreview,
    updateActiveQuestionIndex,
    updateCustomProps,
    updateQuestion,
    updateChoiceText,
    updateSettings,
    updateTitle,
    showUpdateQuestionPage,
    setContext,
    updateCoverImageData,
    initializeExternal,
    openCreationInPersonalAppMode,
    updateTeamsGroupAndChannels,
    setTeamsGroupInitializationState,
    resetSurveyToDefault,
    setChannelPickerDialogOpen,
    setSettingDialogOpen,
    setSendSurveyAlertOpen,
    setPreviousPage,
    setShouldFocusOnError
} from '../actions/CreationActions';
import getStore, { Page } from '../store/creation/Store';
import { QuestionDisplayType } from '../common/QuestionDisplayType';
import { getCoverImage, getRatingQuestionOptions } from '../common/Utils';
import { SurveyViewData, Questions, SurveyViewDataIndices } from '../SurveyViewData';

mutator(setAppInitialized, (msg) => {
    const store = getStore();
    store.isInitialized = msg.state;
});

mutator(updateTitle, (msg) => {
    const store = getStore();
    store.title = msg.value;
});

mutator(addQuestion, (msg) => {
    const questionType: ActionSDK.ActionInstanceColumnType = msg.questionType;
    const displayType: QuestionDisplayType = msg.displayType;
    const store = getStore();
    let questions: ActionSDK.ActionInstanceColumn[] = toJS(store.questions);
    let qID = questions.length;
    let question: ActionSDK.ActionInstanceColumn = {
        id: qID.toString(),
        type: questionType,
        title: "",
        isOptional: true,
        options: []
    }
    if (displayType != null) {
        question.customProperties = JSON.stringify({ "dt": displayType });
        if (displayType == QuestionDisplayType.Select) {
            let option1: ActionSDK.ActionInstanceColumnOption = {
                id: "0",
                title: ""
            };
            let option2: ActionSDK.ActionInstanceColumnOption = {
                id: "1",
                title: ""
            };
            question.options.push(option1, option2);
        }
        if (displayType == QuestionDisplayType.FiveStar) {
            question.options = getRatingQuestionOptions(QuestionDisplayType.FiveStar);
            question.customProperties = JSON.stringify({ ...{ "dt": displayType }, ...msg.customProps });
        }
    }
    questions.push(question);
    store.questions = questions;
    store.activeQuestionIndex = qID;
    if (msg.renderingForMobile) {
        store.previousPage = store.currentPage;
        store.currentPage = Page.UpdateQuestion;
    }
});

mutator(deleteQuestion, (msg) => {
    let index: number = msg.index;
    const store = getStore();
    let questions: ActionSDK.ActionInstanceColumn[] = toJS(store.questions);
    questions.splice(index, 1);
    for (index; index < questions.length; index++) {
        questions[index].id = index.toString();
    }
    store.questions = questions;
    if (store.currentPage == Page.UpdateQuestion) {
        store.previousPage = store.currentPage;
        store.currentPage = Page.Main;
    }
    if (index === getStore().activeQuestionIndex) {
        store.activeQuestionIndex = -1;
    }
});

mutator(updateSettings, (msg) => {
    const store = getStore();
    store.settings = msg.settingProps;
});

mutator(updateQuestion, (msg) => {
    const store = getStore();
    let questions: ActionSDK.ActionInstanceColumn[] = toJS(store.questions);
    questions[msg.questionIndex] = msg.question;
    store.questions = questions;
    store.isValidationModeOn = false;
});

mutator(moveQuestionUp, (msg) => {
    if (msg.index == 0) {
        return;
    }
    const store = getStore();
    let questions: ActionSDK.ActionInstanceColumn[] = toJS(store.questions);
    let currentQuestion: ActionSDK.ActionInstanceColumn = copyQuestion(questions[msg.index]);
    let previousQuestion: ActionSDK.ActionInstanceColumn = copyQuestion(questions[msg.index - 1]);
    currentQuestion.id = (msg.index - 1).toString();
    previousQuestion.id = msg.index.toString();
    questions[msg.index] = previousQuestion;
    questions[msg.index - 1] = currentQuestion;
    store.activeQuestionIndex = msg.index - 1;
    store.questions = questions;
});

mutator(moveQuestionDown, (msg) => {
    const store = getStore();
    if (msg.index == store.questions.length - 1) {
        return;
    }
    let questions: ActionSDK.ActionInstanceColumn[] = toJS(store.questions);
    let currentQuestion = copyQuestion(questions[msg.index]);
    let nextQuestion = copyQuestion(questions[msg.index + 1]);
    currentQuestion.id = (msg.index + 1).toString();
    nextQuestion.id = msg.index.toString();
    questions[msg.index] = nextQuestion;
    questions[msg.index + 1] = currentQuestion;
    store.activeQuestionIndex = msg.index + 1;
    store.questions = questions;
});

mutator(updateActiveQuestionIndex, (msg) => {
    const store = getStore();
    store.activeQuestionIndex = msg.activeIndex;
});

mutator(showPreview, (msg) => {
    const store = getStore();
    store.preview = msg.showPreview;
})

mutator(setValidationMode, (msg) => {
    const store = getStore();
    store.isValidationModeOn = msg.validationMode;
})

mutator(duplicateQuestion, (msg) => {
    const store = getStore();
    let questions: ActionSDK.ActionInstanceColumn[] = toJS(store.questions);
    let currentQuestionCopy = copyQuestion(questions[msg.index]);
    currentQuestionCopy.id = (msg.index + 1).toString();
    let index = questions.length - 1;
    for (index; index >= msg.index + 1; index--) {
        questions[index + 1] = questions[index];
        questions[index + 1].id = (index + 1).toString();
    }
    questions[msg.index + 1] = currentQuestionCopy;
    store.activeQuestionIndex = msg.index + 1;
    store.questions = questions;
})

mutator(setContext, (msg) => {
    const store = getStore();
    store.context = msg.context;
    store.initPending = false;
    if (!ActionSDK.Utils.isEmptyObject(msg.context.viewData)) {
        let viewData: SurveyViewData = JSON.parse(msg.context.viewData);
        getStore().title = viewData.ti;
        updateQuestions(viewData.cl);
        getStore().settings.resultVisibility = getRowsVisibility(viewData.rv);
        getStore().settings.isResponseAnonymous = viewData.ia == 1;
        updateNotificationSettings(viewData.ns);
        getStore().settings.dueDate = viewData.et;
        getStore().settings.isMultiResponseAllowed = viewData.mr == 1;
    }
})

mutator(goToPage, (msg) => {
    const store = getStore();
    store.previousPage = store.currentPage;
    store.currentPage = msg.page;
})

mutator(updateCustomProps, (msg) => {
    const store = getStore();
    const question = store.questions[msg.index];
    question.customProperties = JSON.stringify(msg.customProps);
    store.questions[msg.index] = question;
})

mutator(setSendingFlag, (msg) => {
    const store = getStore();
    store.isSendActionInProgress = msg.value;
})

mutator(updateChoiceText, (msg) => {
    const store = getStore();
    const questionsCopy = [...store.questions];
    questionsCopy[msg.questionIndex].options[msg.choiceIndex].title = msg.text;
    store.questions = questionsCopy;
})

mutator(showUpdateQuestionPage, (msg) => {
    const store = getStore();
    store.activeQuestionIndex = msg.questionIndex;
    store.previousPage = store.currentPage;
    store.currentPage = Page.UpdateQuestion;
})

mutator(updateCoverImageData, msg => {
    const store = getStore();
    store.coverImageData = {
        coverImage: msg.coverImage,
        uploadStatus: msg.sendStatus,
        uploadPromise: msg.uploadPromise
    }
});

function copyQuestion(question: ActionSDK.ActionInstanceColumn): ActionSDK.ActionInstanceColumn {
    return { ...question };
}

mutator(initializeExternal, (msg) => {
    const store = getStore();
    store.title = msg.actionInstance.title;
    store.questions = msg.actionInstance.columns;
    store.draftActionInstanceId = msg.actionInstance.id;
    let actionCoverImage = getCoverImage(msg.actionInstance);

    if (actionCoverImage != undefined) {
        store.coverImageData = {
            coverImage: actionCoverImage,
            uploadStatus: ActionSDK.AttachmentStatus.Uploaded,
            uploadPromise: undefined
        }
    }
});

mutator(openCreationInPersonalAppMode, () => {
    const store = getStore();
    store.inPersonalAppMode = true;
});

mutator(updateTeamsGroupAndChannels, (msg) => {
    const store = getStore();
    store.teamsGroupInitialized = msg.state;
    store.teamsGroups = msg.teamsGroups;
});

mutator(setTeamsGroupInitializationState, (msg) => {
    const store = getStore();
    store.teamsGroupInitialized = msg.state;
});

mutator(resetSurveyToDefault, () => {
    const store = getStore();
    store.previousPage = store.currentPage;
    store.currentPage = Page.Main;
    store.title = "";
    store.questions = [];
    store.coverImageData = undefined;

});

mutator(setChannelPickerDialogOpen, (msg) => {
    const store = getStore();
    store.openChannelPickerDialog = msg.dialogOpenIndicator;
});

mutator(setSettingDialogOpen, (msg) => {
    const store = getStore();
    store.openSettingDialog = msg.openDialog;
});

mutator(setSendSurveyAlertOpen, (msg) => {
    const store = getStore();
    store.isSendSurveyAlertOpen = msg.openDialog;
});

mutator(setPreviousPage, (msg) => {
    const store = getStore();
    store.previousPage = msg.previousPage;
});

mutator(setShouldFocusOnError, (msg) => {
    const store = getStore();
    store.shouldFocusOnError = msg.value;
})

/**
 * Returns ResultVisibility type on the basis of boolean.
 * @param visible variable defining visibility of rows.
 */
function getRowsVisibility(visible: number) {
    if (visible == 1) {
        return ResultVisibility.All;
    } else {
        return ResultVisibility.Sender;
    }
}

/**
 * Populates the settings with values from viewData.
 * @param settings ~ separated settings string from viewData
 */
function updateNotificationSettings(settings: string) {
    let notificationSettings: string[] = settings.split("~");
    let modeIndex = 0;
    let timeIndex = 1;
    getStore().settings.notificationSettings.mode = ActionSDK.NotificationSettingMode[notificationSettings[modeIndex]];
    getStore().settings.notificationSettings.time = parseInt(notificationSettings[timeIndex]);
}

/**
 * Updates the values in getStore().questions using "cl" i.e columns field in viewData
 * @param questions ~ separated  
 */
function updateQuestions(questions: string[]) {
    let columns: ActionSDK.ActionInstanceColumn[] = getStore().questions;
    let id: number = 0;
    questions.forEach(question => {
        // Generates an array with string separated by '~' but ignoring '\~'.
        let questionData: string[] = question.match(/([^\\\][^~]|\\~)+/g);
        // replacing '\~' with '~' in the escaped string
        let titleString = questionData[SurveyViewDataIndices.TitleIndex].replace("\\~", "~");
        let column: ActionSDK.ActionInstanceColumn = {
            title: titleString,
            id: "",
            // Updating with random value for now. Will be filled with correct value in the preceeding code.
            type: ActionSDK.ActionInstanceColumnType[questionData[SurveyViewDataIndices.QuestionTypeIndex]],
            customProperties: "",
            options: []
        };
        column.isOptional = questionData[SurveyViewDataIndices.IsOptionalIndex] == "1" ? true : false;
        let displayType: number = parseInt(questionData[SurveyViewDataIndices.QuestionDisplayTypeIndex]);
        let type = questionData[SurveyViewDataIndices.QuestionTypeIndex];

        let customProperties = getCustomProperty(displayType);
        if (customProperties !== null) {
            column.customProperties = JSON.stringify(customProperties);
        }

        updateOptions(displayType, column.options, questionData.splice(SurveyViewDataIndices.OptionsIndex, questionData.length));

        column.id = id.toString();
        id++;
        columns.push(column);
    });
}

function updateOptions(displayType: QuestionDisplayType, columnOptions: ActionSDK.ActionInstanceColumnOption[], optionsArray: string[]) {
    let optionsCount = 0;
    switch (displayType) {
        case QuestionDisplayType.FiveStar:
        case QuestionDisplayType.FiveNumber:
            optionsCount = 5;
            fillRatingOptions(optionsCount, columnOptions);
            break;
        case QuestionDisplayType.TenStar:
        case QuestionDisplayType.TenNumber:
            optionsCount = 10;
            fillRatingOptions(optionsCount, columnOptions);
            break;
        case QuestionDisplayType.LikeDislike:
            fillLikeDislikeOptions(columnOptions);
            break;
        case QuestionDisplayType.Select:
            fillMultiChoiceOptions(optionsArray, columnOptions);

    }
}

function fillMultiChoiceOptions(optionsArray: string[], columnOptions: ActionSDK.ActionInstanceColumnOption[]) {
    let optionId = 0;
    optionsArray.forEach(option => {
        let columnOption: ActionSDK.ActionInstanceColumnOption = {
            id: optionId.toString(),
            // replacing '\~' with '~' to get original string
            title: option.replace("\\~", "~")
        };
        optionId++;
        columnOptions.push(columnOption);
    });
}

function fillRatingOptions(count: number, columnOptions: ActionSDK.ActionInstanceColumnOption[]) {
    for (let index = 1; index <= count; index++) {
        let columnOption: ActionSDK.ActionInstanceColumnOption = {
            id: index.toString(),
            title: index.toString()
        };
        columnOptions.push(columnOption);
    }
}

function fillLikeDislikeOptions(columnOptions: ActionSDK.ActionInstanceColumnOption[]) {
    let columnOptionLike: ActionSDK.ActionInstanceColumnOption = {
        id: "0",
        title: "Like"
    };
    let columnOptionDisLike: ActionSDK.ActionInstanceColumnOption = {
        id: "1",
        title: "Dislike"
    };
    columnOptions.push(columnOptionLike);
    columnOptions.push(columnOptionDisLike);
}

function getCustomProperty(displayType: number) {
    switch (displayType) {
        case QuestionDisplayType.Select:
        case QuestionDisplayType.None:
            return {
                dt: displayType
            };
        case QuestionDisplayType.FiveStar:
            return {
                dt: displayType,
                level: 5,
                type: ActionSDK.Localizer.getString("StarText")
            }
        case QuestionDisplayType.TenStar:
            return {
                dt: displayType,
                level: 10,
                type: ActionSDK.Localizer.getString("StarText")
            }
        case QuestionDisplayType.FiveNumber:
            return {
                dt: displayType,
                level: 5,
                type: ActionSDK.Localizer.getString("Number")
            }
        case QuestionDisplayType.TenNumber:
            return {
                dt: displayType,
                level: 10,
                type: ActionSDK.Localizer.getString("Number")
            }
        case QuestionDisplayType.LikeDislike:
            return {
                dt: displayType,
                type: ActionSDK.Localizer.getString("LikeDislike")
            }
    }
    return null;
}