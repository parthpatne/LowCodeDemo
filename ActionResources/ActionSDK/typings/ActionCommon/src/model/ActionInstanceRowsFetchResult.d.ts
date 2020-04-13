import { ActionInstanceRow } from "./ActionInstanceRow";
export interface ActionInstanceRowsFetchResult {
    rows: ActionInstanceRow[];
    continuationToken: string;
}
