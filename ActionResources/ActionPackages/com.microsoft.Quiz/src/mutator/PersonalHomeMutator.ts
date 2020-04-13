import { mutator } from "satcheljs";
import getStore from "../store/personalApp/Store";
import * as ActionSDK from "@actionSDK";
import { goToPage, setAppInitialized, addOrUpdateActionInstanceInStore, updateActionInstanceSummary, deleteActionInstanceInStore } from "../actions/PersonalHomeActions";
import { InitializationState } from '@sharedUI';

mutator(goToPage, (msg) => {
    const store = getStore();
    store.currentPage = msg.page;
})

mutator(setAppInitialized, (msg) => {
    const store = getStore();
    store.isInitialized = msg.state;
    store.context = msg.context;

    if (msg.actionInstanceResponse == null || msg.templateActionResponse == null)
        return;

    for (const [key, templates] of Object.entries(msg.templateActionResponse.actions)) {
        store.sortedTemplatePageMap[key] = templates;
        for (let listInstance of templates) {
            let actionInstance: ActionSDK.ActionInstance = listInstance;
            store.templateSurveyMap[actionInstance.id] = actionInstance;
        }
    }

    for (let listInstance of msg.actionInstanceResponse.actions) {
        let actionInstance: ActionSDK.ActionInstance = listInstance;
        store.otherSurveyMap[actionInstance.id] = actionInstance;
    }

    for (let listInstance of msg.draftActionInstanceResponse.actions) {
        let actionInstance: ActionSDK.ActionInstance = listInstance;
        store.otherSurveyMap[actionInstance.id] = actionInstance;
    }

    sortOtherActionInstanceMap();

    store.actionInstanceContinuationToken = msg.actionInstanceResponse.cntToken;
    store.templateContinuationToken = msg.templateActionResponse.cntToken;
    store.draftContinuationToken = msg.draftActionInstanceResponse.cntToken;
    store.teamIdToTeamsGroupMap = msg.teamIdToTeamsGroupMap;

});

mutator(addOrUpdateActionInstanceInStore, (msg) => {
    const store = getStore();
    let actionInstance: ActionSDK.ActionInstance = msg.updatedSurvey;
    if (actionInstance)
        store.otherSurveyMap[actionInstance.id] = actionInstance;

    sortOtherActionInstanceMap();
});

mutator(deleteActionInstanceInStore, (msg) => {
    const store = getStore();
    delete store.otherSurveyMap[msg.id];
    sortOtherActionInstanceMap();
});

mutator(updateActionInstanceSummary, (msg) => {
    const store = getStore();

    if (msg.actionInstanceSummary != null) {
        store.actionInstanceResponseInitializationMap.set(msg.actionInstanceId, InitializationState.Initialized);
        store.actionIdActionSummaryMap[msg.actionInstanceId] = msg.actionInstanceSummary;
    }
    else {
        store.actionInstanceResponseInitializationMap.set(msg.actionInstanceId, InitializationState.Failed);
    }
});

function sortOtherActionInstanceMap() {
    const store = getStore();
    let actionInstanceArray = Array.from(Object.values(store.otherSurveyMap));
    let sortedActionArray = actionInstanceArray.sort((actionInstanceA: ActionSDK.ActionInstance, actionInstanceB: ActionSDK.ActionInstance) => {
        return actionInstanceB.updateTime - actionInstanceA.updateTime;
    });
    store.sortedActionInstanceArray = sortedActionArray;
}