import { ActionInstanceColumnType } from "./ActionInstanceColumnType";
import { ActionInstanceColumnOption } from "./ActionInstanceColumnOption";
import { Attachment } from "./Attachment";
export interface ActionInstanceColumn {
    id: string;
    type: ActionInstanceColumnType;
    title: string;
    isInvisible?: boolean;
    isOptional?: boolean;
    isExcludedFromReporting?: boolean;
    allowOtherOption?: boolean;
    options?: ActionInstanceColumnOption[];
    customProperties?: string;
    attachments?: Attachment[];
}
