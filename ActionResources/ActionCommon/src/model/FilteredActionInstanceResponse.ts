import { ActionInstance } from "./ActionInstance";
import { ActionInstanceFilter } from "./ActionInstanceFilter";

export interface FilteredActionInstanceResponse {

    /** List of actions returned in API call*/
    actions: ActionInstance[];

    /** Filteres passed while making the call */
    filters: ActionInstanceFilter[];

    /** Continuation to fetch more data */
    cntToken: string;
}