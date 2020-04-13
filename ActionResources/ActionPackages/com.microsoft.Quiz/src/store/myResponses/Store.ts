import { createStore } from 'satcheljs';
import "../../mutator/MyResponsesMutator";
import * as ActionSDK from "@actionSDK";

interface ISurveyMyResponsesStore {
    myResponses: ActionSDK.ActionInstanceRow[];
    currentActiveIndex: number;
    myProfile: ActionSDK.UserProfile;
}

const store: ISurveyMyResponsesStore = {
    myResponses: [],
    currentActiveIndex: -1,
    myProfile: null
}

export default createStore<ISurveyMyResponsesStore>('responsesStore', store);