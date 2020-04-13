import { mutator } from "satcheljs";
import * as ActionSDK from "@actionSDK";
import { toJS } from "mobx";
import getStore, { SummaryPageViewType, ResponsesListViewType } from "../store/summary/Store";
import {
    setContext,
    showMoreOptions,
    updateSummary,
    updateActionInstance,
    setDueDate,
    updateUserProfileMap,
    setCurrentView,
    goBack,
    updateNonResponders,
    updateMemberCount,
    updateCurrentResponseIndex,
    addActionInstanceRows,
    setProgressStatus,
    updateMyRows,
    surveyCloseAlertOpen,
    surveyDeleteAlertOpen,
    surveyExpiryChangeAlertOpen,
    updateUserProfilePic,
    updateContinuationToken,
    setResponseViewType,
    openSummaryInPersonalAppMode,
    setSelectedQuestionDrillDownInfo,
    setIsActionDeleted
} from "../actions/SummaryActions";

mutator(setContext, (msg) => {
    const store = getStore();
    store.context = msg.context;
});

mutator(setProgressStatus, (msg) => {
    const store = getStore();
    store.progressStatus = {
        ...getStore().progressStatus,
        ...msg.status
    };
});

mutator(updateMyRows, (msg) => {
    const store = getStore();
    store.myRows = msg.rows;
});

mutator(setDueDate, (msg) => {
    const store = getStore();
    store.dueDate = msg.date;
});

mutator(showMoreOptions, (msg) => {
    const store = getStore();
    store.showMoreOptionsList = msg.showMoreOptions;
});

mutator(updateSummary, (msg) => {
    const store = getStore();
    store.actionSummary = msg.actionInstanceSummary
});

mutator(updateActionInstance, (msg) => {
    const store = getStore();
    store.actionInstance = msg.actionInstance;
    store.dueDate = msg.actionInstance.expiry;
});

mutator(surveyCloseAlertOpen, (msg) => {
    const store = getStore();
    store.isSurveyCloseAlertOpen = msg.open;
});

mutator(surveyExpiryChangeAlertOpen, (msg) => {
    const store = getStore();
    store.isChangeExpiryAlertOpen = msg.open;
});

mutator(surveyDeleteAlertOpen, (msg) => {
    const store = getStore();
    store.isDeleteSurveyAlertOpen = msg.open;
});

mutator(updateUserProfileMap, (msg) => {
    const store = getStore();
    store.userProfile = Object.assign(store.userProfile, msg.userProfileMap);
});

mutator(setCurrentView, (msg) => {
    const store = getStore();
    store.currentView = msg.view;
});

mutator(goBack, () => {
    const store = getStore();
    let currentView: SummaryPageViewType = store.currentView;

    switch (currentView) {
        case SummaryPageViewType.ResponseAggregationView:
        case SummaryPageViewType.ResponderView:
            store.currentView = SummaryPageViewType.Main;
            break;

        case SummaryPageViewType.ResponseView:
            if (store.responseViewType === ResponsesListViewType.MyResponses && store.myRows.length > 0) {
                store.currentView = SummaryPageViewType.Main;
                break;
            }
            store.currentView = SummaryPageViewType.ResponderView;
            break;

        case SummaryPageViewType.NonResponderView:
            store.currentView = SummaryPageViewType.Main;
            break;

        default:
            break;
    }
});

mutator(updateNonResponders, (msg) => {
    const store = getStore();
    const nonResponderList = msg.nonResponder.nonResponders;
    if (!ActionSDK.Utils.isEmptyObject(nonResponderList) && nonResponderList.length > 0) {
        nonResponderList.sort((object1, object2) => {
            if (object1.displayName < object2.displayName) {
                return -1;
            }
            if (object1.displayName > object2.displayName) {
                return 1;
            }
            return 0;
        });
    }
    store.nonResponders = msg.nonResponder;
});

mutator(updateMemberCount, (msg) => {
    const store = getStore();
    store.memberCount = msg.memberCount;
});

mutator(updateCurrentResponseIndex, (msg) => {
    const store = getStore();
    store.currentResponseIndex = msg.index;
});

mutator(addActionInstanceRows, (msg) => {
    const store = getStore();
    store.actionInstanceRows = store.actionInstanceRows.concat(msg.rows);
});

mutator(updateUserProfilePic, (msg) => {
    const store = getStore();
    let userProfile: { [key: string]: ActionSDK.UserProfile } = toJS(getStore().userProfile);
    Object.keys(msg.userProfilePicMap).forEach((userId: string) => {
        if (userProfile[userId]) {
            userProfile[userId].profilePhoto = msg.userProfilePicMap[userId];
        }
    });
    store.userProfile = userProfile;
});

mutator(updateContinuationToken, (msg) => {
    const store = getStore();
    store.continuationToken = msg.token;
});

mutator(setResponseViewType, (msg) => {
    const store = getStore();
    store.responseViewType = msg.responseViewType;
})

mutator(openSummaryInPersonalAppMode, () => {
    const store = getStore();
    store.inPersonalAppMode = true;
});

mutator(setSelectedQuestionDrillDownInfo, (msg) => {
    const store = getStore();
    store.selectedQuestionDrillDownInfo = msg.questionDrillDownInfo;
})

mutator(setIsActionDeleted, (msg) => {
    const store = getStore();
    store.isActionDeleted = msg.isActionDeleted;
});
