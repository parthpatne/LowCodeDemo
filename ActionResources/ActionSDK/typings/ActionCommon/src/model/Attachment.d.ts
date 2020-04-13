import { AttachmentType } from "./AttachmentType";
export interface Attachment {
    id: string;
    type: AttachmentType;
    name?: string;
    bytes?: number;
    url: string;
}
