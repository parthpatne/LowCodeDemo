import { ActionInstanceFilter } from "./ActionInstanceFilter";

export interface FilteredActionInstanceRequest {

    /** Batch size for getting number of action instances. 30 will be returned by default*/
    batchSize: number;

    /** Filters passed while making the call */
    filters: string;

    /** Continuation to fetch more data */
    cntToken: string;
}