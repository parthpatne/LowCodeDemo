import { ActionInstanceProperty } from "./ActionInstanceProperty";
import { ActionInstancePropertyUpdateType } from "./ActionInstancePropertyUpdateType";
export interface ActionInstancePropertyUpdateInfo extends ActionInstanceProperty {
    updateType: ActionInstancePropertyUpdateType;
}
