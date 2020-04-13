"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionInstancePropertyType_1 = require("./model/ActionInstancePropertyType");
var Visibility_1 = require("./model/Visibility");
var Utils_1 = require("./Utils");
var ActionUtils;
(function (ActionUtils) {
    function getActionInstanceProperty(actionInstance, propertyName) {
        if (actionInstance.properties && actionInstance.properties.length > 0) {
            for (var _i = 0, _a = actionInstance.properties; _i < _a.length; _i++) {
                var property = _a[_i];
                if (property.name == propertyName) {
                    return property;
                }
            }
        }
        return null;
    }
    ActionUtils.getActionInstanceProperty = getActionInstanceProperty;
    function prepareActionInstance(actionInstance, actionContext) {
        if (Utils_1.Utils.isEmptyString(actionInstance.id)) {
            actionInstance.id = Utils_1.Utils.generateGUID();
            actionInstance.createTime = Date.now();
        }
        if (Utils_1.Utils.isEmptyObject(actionInstance.conversationInfo)) {
            actionInstance.conversationInfo = actionContext.conversationInfo;
        }
        actionInstance.updateTime = Date.now();
        actionInstance.creatorId = actionContext.userId;
        actionInstance.clientType = actionContext.hostType;
        actionInstance.actionPackageId = actionContext.actionPackageId;
        actionInstance.version = actionInstance.version || 1;
        actionInstance.canUserEditRows = actionInstance.canUserEditRows || true;
        actionInstance.canUserAddMultipleRows = actionInstance.canUserAddMultipleRows || false;
        actionInstance.rowsVisibility = actionInstance.rowsVisibility || Visibility_1.Visibility.All;
        actionInstance.sendReminderVisibility = actionInstance.sendReminderVisibility || Visibility_1.Visibility.Sender;
        actionInstance.isAnonymous = actionInstance.isAnonymous || false;
        if (getActionInstanceProperty(actionInstance, "Locale") == null) {
            actionInstance.properties = actionInstance.properties || [];
            actionInstance.properties.push({
                name: "Locale",
                type: ActionInstancePropertyType_1.ActionInstancePropertyType.Text,
                value: actionContext.locale
            });
        }
    }
    ActionUtils.prepareActionInstance = prepareActionInstance;
    function prepareActionInstanceRow(actionInstanceRow) {
        if (Utils_1.Utils.isEmptyString(actionInstanceRow.id)) {
            actionInstanceRow.id = Utils_1.Utils.generateGUID();
            actionInstanceRow.createTime = Date.now();
        }
        actionInstanceRow.updateTime = Date.now();
        actionInstanceRow.isAnonymous = actionInstanceRow.isAnonymous || false;
        if (actionInstanceRow.isAnonymous) {
            actionInstanceRow.creatorId = undefined;
        }
    }
    ActionUtils.prepareActionInstanceRow = prepareActionInstanceRow;
    function prepareActionInstanceRows(actionInstanceRows) {
        for (var _i = 0, actionInstanceRows_1 = actionInstanceRows; _i < actionInstanceRows_1.length; _i++) {
            var actionInstanceRow = actionInstanceRows_1[_i];
            this.prepareActionInstanceRow(actionInstanceRow);
        }
    }
    ActionUtils.prepareActionInstanceRows = prepareActionInstanceRows;
})(ActionUtils = exports.ActionUtils || (exports.ActionUtils = {}));
