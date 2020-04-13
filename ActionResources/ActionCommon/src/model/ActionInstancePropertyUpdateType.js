"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionInstancePropertyUpdateType;
(function (ActionInstancePropertyUpdateType) {
    // Replace the old property value with a new one
    ActionInstancePropertyUpdateType["Update"] = "Update";
    // Add a whole new property
    ActionInstancePropertyUpdateType["Add"] = "Add";
    // Delete a whole property
    ActionInstancePropertyUpdateType["Delete"] = "Delete";
    // Replace an entry in the property value (Array type) with a new one
    ActionInstancePropertyUpdateType["Replace"] = "Replace";
    // Add entries in the property value (Array type)
    ActionInstancePropertyUpdateType["Append"] = "Append";
    // Remove entries from the property value (Array type)
    ActionInstancePropertyUpdateType["Remove"] = "Remove";
})(ActionInstancePropertyUpdateType = exports.ActionInstancePropertyUpdateType || (exports.ActionInstancePropertyUpdateType = {}));
