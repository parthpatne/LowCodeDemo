import { ActionInstance } from "./model/ActionInstance";
import { ActionInstanceRow } from "./model/ActionInstanceRow";
import { ActionInstanceProperty } from "./model/ActionInstanceProperty";
import { ActionInstancePropertyType } from "./model/ActionInstancePropertyType";
import { Visibility } from "./model/Visibility";
import { ActionContext } from "./ActionContext";
import { Utils } from "./Utils";

export namespace ActionUtils {
    export function getActionInstanceProperty(actionInstance: ActionInstance, propertyName: string): ActionInstanceProperty {
        if (actionInstance.properties && actionInstance.properties.length > 0) {
            for (let property of actionInstance.properties) {
                if (property.name == propertyName) {
                    return property;
                }
            }
        }
        return null;
    }

    export function prepareActionInstance(actionInstance: ActionInstance, actionContext: ActionContext) {
        if (Utils.isEmptyString(actionInstance.id)) {
            actionInstance.id = Utils.generateGUID();
            actionInstance.createTime = Date.now();
        }
        if (Utils.isEmptyObject(actionInstance.conversationInfo)) {
            actionInstance.conversationInfo = actionContext.conversationInfo;
        }
        actionInstance.updateTime = Date.now();
        actionInstance.creatorId = actionContext.userId;
        actionInstance.clientType = actionContext.hostType;
        actionInstance.actionPackageId = actionContext.actionPackageId;
        actionInstance.version = actionInstance.version || 1;
        actionInstance.canUserEditRows = actionInstance.canUserEditRows || true;
        actionInstance.canUserAddMultipleRows = actionInstance.canUserAddMultipleRows || false;
        actionInstance.rowsVisibility = actionInstance.rowsVisibility || Visibility.All;
        actionInstance.sendReminderVisibility = actionInstance.sendReminderVisibility || Visibility.Sender;
        actionInstance.isAnonymous = actionInstance.isAnonymous || false;
        if (getActionInstanceProperty(actionInstance, "Locale") == null) {
            actionInstance.properties = actionInstance.properties || [];
            actionInstance.properties.push({
                name: "Locale",
                type: ActionInstancePropertyType.Text,
                value: actionContext.locale
            });
        }
    }

    export function prepareActionInstanceRow(actionInstanceRow: ActionInstanceRow) {
        if (Utils.isEmptyString(actionInstanceRow.id)) {
            actionInstanceRow.id = Utils.generateGUID();
            actionInstanceRow.createTime = Date.now();
        }
        actionInstanceRow.updateTime = Date.now();
        actionInstanceRow.isAnonymous = actionInstanceRow.isAnonymous || false;
        if (actionInstanceRow.isAnonymous) {
            actionInstanceRow.creatorId = undefined;
        }
    }

    export function prepareActionInstanceRows(actionInstanceRows: ActionInstanceRow[]) {
        for (let actionInstanceRow of actionInstanceRows) {
            this.prepareActionInstanceRow(actionInstanceRow);
        }
    }
}