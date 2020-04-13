import { action } from "satcheljs";
import * as ActionSDK from "@actionSDK";

enum SurveyMyResponsesAction {
    initializeMyResponses = "initializeMyResponses",
    initializeMyResponsesWithProfile = "initializeMyResponsesWithProfile"
}

export let initializeMyResponses = action(SurveyMyResponsesAction.initializeMyResponses, (actionInstanceRows: ActionSDK.ActionInstanceRow[]) => ({
    actionInstanceRows: actionInstanceRows
}));

export let initializeMyResponsesWithProfile = action(SurveyMyResponsesAction.initializeMyResponsesWithProfile, (actionInstanceRows: ActionSDK.ActionInstanceRow[], myProfile: ActionSDK.UserProfile) => ({
    actionInstanceRows: actionInstanceRows,
    myProfile: myProfile
}));