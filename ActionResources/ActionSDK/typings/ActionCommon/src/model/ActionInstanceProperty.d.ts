import { ActionInstancePropertyType } from "./ActionInstancePropertyType";
export interface ActionInstanceProperty {
    name: string;
    /** Type of the metadata */
    type: ActionInstancePropertyType;
    /** Value of the metadata */
    value: string;
}
