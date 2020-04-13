import { ActionInstance } from "./ActionInstance";
import { ActionInstanceFilter } from "./ActionInstanceFilter";

export interface FilteredTemplateActionInstanceResponse {

    /** List of actions returned in API call*/
    actions: { [key: string]: ActionInstance[] };

    /** Filteres passed while making the call */
    filters: ActionInstanceFilter[];

    /** Continuation to fetch more data */
    cntToken: string;
}