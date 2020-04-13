import { Attachment } from "./Attachment";
export interface ActionInstanceColumnOption {
    id: string;
    title: string;
    attachments?: Attachment[];
}
