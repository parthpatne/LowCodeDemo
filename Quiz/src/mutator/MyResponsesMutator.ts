import { mutator } from "satcheljs";
import getStore from "../store/myResponses/Store";
import { initializeMyResponses, initializeMyResponsesWithProfile } from "../actions/MyResponsesActions";

mutator(initializeMyResponses, (msg) => {
    const store = getStore();
    store.myResponses = msg.actionInstanceRows;
});

mutator(initializeMyResponsesWithProfile, (msg) => {
    const store = getStore();
    store.myResponses = msg.actionInstanceRows;
    store.myProfile = msg.myProfile;
});