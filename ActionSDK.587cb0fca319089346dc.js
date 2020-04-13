(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["ActionSDK"],{

/***/ "../../ActionSDK/src/APIs.ts":
/*!*************************************************************************************************************!*\
  !*** C:/AssWorkstation/ActionsPlatform/src/KaizalaAggregationService/ActionResources/ActionSDK/src/APIs.ts ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ActionHostInterface_1 = __webpack_require__(/*! ./ActionHostInterface */ "../../ActionSDK/src/ActionHostInterface.ts");
var _actionCommon_1 = __webpack_require__(/*! @actionCommon */ "../../ActionCommon/src/index.ts");
var APIs;
(function (APIs) {
    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    function createActionInstance(actionInstance, viewData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.CreateActionInstance, [actionInstance, viewData])];
            });
        });
    }
    APIs.createActionInstance = createActionInstance;
    /**
    * Creates a new Action instance along with the given rows
    * @param {ActionInstance} actionInstance
    * @param {ActionInstanceRow[]} actionInstanceRows
    * @return promise returning either success or ActionError
    */
    function createActionInstanceWithRows(actionInstance, actionInstanceRows, viewData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.CreateActionInstanceWithRows, [actionInstance, actionInstanceRows, viewData])];
            });
        });
    }
    APIs.createActionInstanceWithRows = createActionInstanceWithRows;
    /**
    * Gets the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either ActionInstance or ActionError
    */
    function getActionInstance(actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetActionInstance, [actionInstanceId])];
            });
        });
    }
    APIs.getActionInstance = getActionInstance;
    /**
    * Updates the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @param {ActionInstanceUpdateInfo} actionInstanceUpdateInfo
    * @return promise returning either success or ActionError
    */
    function updateActionInstance(actionInstanceId, actionInstanceUpdateInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.UpdateActionInstance, [actionInstanceId, actionInstanceUpdateInfo])];
            });
        });
    }
    APIs.updateActionInstance = updateActionInstance;
    /**
    * Deletes the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either success or ActionError
    */
    function deleteActionInstance(actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.DeleteActionInstance, [actionInstanceId])];
            });
        });
    }
    APIs.deleteActionInstance = deleteActionInstance;
    /**
    * Sends a reminder for the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either success or ActionError
    */
    function sendActionInstanceReminder(actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.SendActionInstanceReminder, [actionInstanceId])];
            });
        });
    }
    APIs.sendActionInstanceReminder = sendActionInstanceReminder;
    /**
    * Creates or updates Action instance rows
    * @param {string} actionInstanceId ID of the action instance
    * @param {ActionInstanceRow[]} actionInstanceRows An array of ActionInstanceRow instances
    * @return promise returning either success or ActionError
    */
    function createOrUpdateActionInstanceRows(actionInstanceId, actionInstanceRows) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.CreateOrUpdateActionInstanceRows, [actionInstanceId, actionInstanceRows])];
            });
        });
    }
    APIs.createOrUpdateActionInstanceRows = createOrUpdateActionInstanceRows;
    /**
    * Gets an Action instance row corresponding to the given id
    * @param {string} actionInstanceId ID of the action instance
    * @param {string} actionInstanceRowId ID of the action instance row to fetch
    * @return promise returning either ActionInstanceRow or ActionError
    */
    function getActionInstanceRow(actionInstanceId, actionInstanceRowId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetActionInstanceRow, [actionInstanceId, actionInstanceRowId])];
            });
        });
    }
    APIs.getActionInstanceRow = getActionInstanceRow;
    /**
    * Gets Action instance rows
    * @param {string} actionInstanceId ID of the action instance
    * @param {string} creatorId ID of the creator of the action instance rows to fetch
    * @param {string} continuationToken continuation token to handle paged results
    * @param {number} pageSize size of the page (number of results to fetch in one call)
    * @return promise returning either an array of ActionInstanceRow or ActionError
    */
    function getActionInstanceRows(actionInstanceId, creatorId, continuationToken, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: The following implementation will be udpated once continuationToken support is added on service
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetActionInstanceRows, [actionInstanceId, creatorId, continuationToken, pageSize])];
            });
        });
    }
    APIs.getActionInstanceRows = getActionInstanceRows;
    /**
    * Deletes an Action instance row
    * @param {string} actionInstanceId ID of the action instance
    * @param {string} actionInstanceRowId ID of the action instance row to delete
    * @return promise returning either success or ActionError
    */
    function deleteActionInstanceRow(actionInstanceId, actionInstanceRowId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.DeleteActionInstanceRow, [actionInstanceId, actionInstanceRowId])];
            });
        });
    }
    APIs.deleteActionInstanceRow = deleteActionInstanceRow;
    /**
    * Gets the summary of the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @param {boolean} isShortSummary flag denoting if aggregates are to be returned with the summary
    * @return promise returning either ActionInstanceSummary or ActionError
    */
    function getActionInstanceSummary(actionInstanceId, isShortSummary) {
        if (isShortSummary === void 0) { isShortSummary = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetActionInstanceSummary, [actionInstanceId, isShortSummary])];
            });
        });
    }
    APIs.getActionInstanceSummary = getActionInstanceSummary;
    /**
    * Downloads the Action instance result result
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either success or ActionError
    */
    function downloadActionInstanceResult(actionInstanceId, fileName) {
        if (fileName === void 0) { fileName = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.DownloadActionInstanceResult, [actionInstanceId, fileName])];
            });
        });
    }
    APIs.downloadActionInstanceResult = downloadActionInstanceResult;
    /**
    * Gets non responders of the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either an array of non-responders or ActionError
    */
    function getActionInstanceNonResponders(actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetActionInstanceNonResponoders, [actionInstanceId])];
            });
        });
    }
    APIs.getActionInstanceNonResponders = getActionInstanceNonResponders;
    /**
    * Gets the members count of the current conversation
    * @param {ConversationInfo} conversationInfo conversation details
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either a result or ActionError
    */
    function getConversationMembersCount(conversationInfo, actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetConversationMembersCount, [conversationInfo, actionInstanceId])];
            });
        });
    }
    APIs.getConversationMembersCount = getConversationMembersCount;
    /**
    * Gets the members of the current conversation
    * @param {ConversationInfo} conversationInfo conversation details
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either an array of members or ActionError
    */
    function getConversationMembers(conversationInfo, actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetConversationMembers, [conversationInfo, actionInstanceId])];
            });
        });
    }
    APIs.getConversationMembers = getConversationMembers;
    /**
    * Gets the details of the given user ids
    * @param {string[]} userIDs array of user ids
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either UserProfilesFetchResult or ActionError
    */
    function getUserProfiles(userIDs, actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetUserProfiles, [userIDs, actionInstanceId])];
            });
        });
    }
    APIs.getUserProfiles = getUserProfiles;
    /**
    * Gets profile photos of the given user ids
    * @param {string[]} userIDs array of user ids
    * @return promise returning either ProfilePhotosFetchResult or ActionError
    */
    function getUserProfilePhotos(userIDs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetUserProfilePhotos, [userIDs])];
            });
        });
    }
    APIs.getUserProfilePhotos = getUserProfilePhotos;
    /**
    * Sets the nav bar items when the host's client type is mobile
    * @param {NavBarMenuItem[]} menuItems list of NavBarMenuItems
    * @param {(id: string) => void} callback callback function to be called when menu item is tapped
    * @return promise returning either success or ActionError
    */
    function setNavBarMenuItems(menuItems, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.registerActionSDKCallback(_actionCommon_1.ActionSdkCommand.SetNavBarMenuItems, [menuItems], callback)];
            });
        });
    }
    APIs.setNavBarMenuItems = setNavBarMenuItems;
    /**
    * Get current Action context
    * @return promise returning either ActionContext or ActionError
    */
    function getCurrentContext() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetCurrentContext)];
            });
        });
    }
    APIs.getCurrentContext = getCurrentContext;
    /**
    * Dismiss the current screen.
    * @return promise returning either success or ActionError
    */
    function dismissScreen() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.DismissScreen)];
            });
        });
    }
    APIs.dismissScreen = dismissScreen;
    /**
    * Show the diagnostic view containing diagnostic logs
    * @return promise returning either success or ActionError
    */
    function showDiagnosticView() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.ShowDiagnosticView)];
            });
        });
    }
    APIs.showDiagnosticView = showDiagnosticView;
    /**
     * To notify app loaded to hide loading indicator
     * @return promise returning false if already called once else true.
     */
    function hideLoadingIndicator() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.HideLoadingIndicator, [])];
            });
        });
    }
    APIs.hideLoadingIndicator = hideLoadingIndicator;
    /**
    * Log given props and time to render view. Must be called only once.
    * It will log only one time in one instance of Task module.
    * @return promise returning either success or ActionError
    */
    var actionViewLoadCalled = false;
    function actionViewDidLoad(success, props) {
        if (props === void 0) { props = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (actionViewLoadCalled) {
                    return [2 /*return*/];
                }
                actionViewLoadCalled = true;
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.ActionViewDidLoad, [success, props])];
            });
        });
    }
    APIs.actionViewDidLoad = actionViewDidLoad;
    /**
    * Registers a handler for the hardware back button in Android
    * @param {() => void} handler handler method to be invoked when back button is pressed
    * @return promise returning either success or ActionError
    */
    function registerBackButtonHandler(handler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.registerActionSDKCallback(_actionCommon_1.ActionSdkCommand.RegisterBackButtonHandler, [], handler)];
            });
        });
    }
    APIs.registerBackButtonHandler = registerBackButtonHandler;
    /**
    * Call server to get list of templates from server.
    * @param string filter required for getting list of templates
    * @return promise returning either List of ActionInstances or ActionError
    */
    function getTemplateActions(filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetTemplateActions, [filter])];
            });
        });
    }
    APIs.getTemplateActions = getTemplateActions;
    /**
    * Call server to get list of user actions from server.
    * @param string filter required for getting list of Active action instance
    * @return promise returning either List of ActionInstances or ActionError
    */
    function getActionInstances(filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetActionInstances, [filter])];
            });
        });
    }
    APIs.getActionInstances = getActionInstances;
    /**
     * Call server to get list of user actions from server.
     * @param string filter required for getting list of Drafts
     * @return promise returning either List of ActionInstances or ActionError
     */
    function getDraftActionInstances(filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetDraftActionInstances, [filter])];
            });
        });
    }
    APIs.getDraftActionInstances = getDraftActionInstances;
    /**
    * Call server to create a action as draft
    * @param actionInstance action instance object to create
    * @return promise returning either ActionInstances or ActionError
    */
    function saveActionInstanceDraft(actionInstance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.SaveActionInstanceDraft, [actionInstance])];
            });
        });
    }
    APIs.saveActionInstanceDraft = saveActionInstanceDraft;
    /**
     * Call server to update the draft
     * @param actionInstance action instance object to update
     * @return promise returning success or ActionError
     */
    function updateActionInstanceDraft(actionInstance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.UpdateActionInstanceDraft, [actionInstance])];
            });
        });
    }
    APIs.updateActionInstanceDraft = updateActionInstanceDraft;
    /**
     * send draft
     * @return promise returning list of groups and channels
     */
    function promoteDraftToAction(actionInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.PromoteDraftToAction, [actionInstanceId])];
            });
        });
    }
    APIs.promoteDraftToAction = promoteDraftToAction;
    /**
     * Creates a new Action instance
     * @param {ActionInstance} actionInstance
     * @return promise returning either success or ActionError
     */
    function createActionInstanceNoBot(actionInstance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.CreateActionInstanceNoBot, [actionInstance])];
            });
        });
    }
    APIs.createActionInstanceNoBot = createActionInstanceNoBot;
    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    function getJoinedTeams() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetJoinedTeams)];
            });
        });
    }
    APIs.getJoinedTeams = getJoinedTeams;
    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    function getListOfChannelsForGroups(listOfGroups) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetListOfChannelsForGroups, [listOfGroups])];
            });
        });
    }
    APIs.getListOfChannelsForGroups = getListOfChannelsForGroups;
})(APIs = exports.APIs || (exports.APIs = {}));


/***/ }),

/***/ "../../ActionSDK/src/ActionHostInterface.ts":
/*!****************************************************************************************************************************!*\
  !*** C:/AssWorkstation/ActionsPlatform/src/KaizalaAggregationService/ActionResources/ActionSDK/src/ActionHostInterface.ts ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Host;
(function (Host) {
    // Communication towards host
    function executeActionSDKApi(command, args) {
        if (args === void 0) { args = []; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!actionHost) {
                    console.error("ActionHost is not set");
                    return [2 /*return*/];
                }
                return [2 /*return*/, actionHost.executeActionSDKApi(command, args)];
            });
        });
    }
    Host.executeActionSDKApi = executeActionSDKApi;
    function registerActionSDKCallback(command, args, handler) {
        if (args === void 0) { args = []; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!actionHost) {
                    console.error("ActionHost is not set");
                    return [2 /*return*/];
                }
                return [2 /*return*/, actionHost.registerActionSDKCallback(command, args, handler)];
            });
        });
    }
    Host.registerActionSDKCallback = registerActionSDKCallback;
})(Host = exports.Host || (exports.Host = {}));


/***/ }),

/***/ "../../ActionSDK/src/Localizer.ts":
/*!******************************************************************************************************************!*\
  !*** C:/AssWorkstation/ActionsPlatform/src/KaizalaAggregationService/ActionResources/ActionSDK/src/Localizer.ts ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ActionHostInterface_1 = __webpack_require__(/*! ./ActionHostInterface */ "../../ActionSDK/src/ActionHostInterface.ts");
var _actionCommon_1 = __webpack_require__(/*! @actionCommon */ "../../ActionCommon/src/index.ts");
var Localizer = /** @class */ (function () {
    function Localizer() {
    }
    /**
     * Get localized Action strings. It will first try to fetch the proper locale strings
     * i.e. content of string_<language>.json within the Action package. If that is not
     * found it will fallback to default locale strings i.e. strings_en.json file.
     * @return promise returning either success or ActionError
     */
    Localizer.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.GetLocalizedActionStrings)];
                    case 1:
                        _a.jsonObject = _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Get localized value of the given string id.
     * If any id is not found the same will be returned.
     * @param stringId id of the string to be localized
     * @param args any arguments which needs to passed
     */
    Localizer.getString = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.jsonObject && this.jsonObject[id])
            return this.getStringInternal.apply(this, [this.jsonObject[id]].concat(args));
        return this.getStringInternal.apply(this, [id].concat(args));
    };
    Localizer.getStringInternal = function (main) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var formatted = main;
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, args[i]);
        }
        return formatted;
    };
    Localizer.jsonObject = {};
    return Localizer;
}());
exports.Localizer = Localizer;


/***/ }),

/***/ "../../ActionSDK/src/Logger.ts":
/*!***************************************************************************************************************!*\
  !*** C:/AssWorkstation/ActionsPlatform/src/KaizalaAggregationService/ActionResources/ActionSDK/src/Logger.ts ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ActionHostInterface_1 = __webpack_require__(/*! ./ActionHostInterface */ "../../ActionSDK/src/ActionHostInterface.ts");
var _actionCommon_1 = __webpack_require__(/*! @actionCommon */ "../../ActionCommon/src/index.ts");
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Logger.logInternal = function (logLevel, logTag, logMessage) {
        ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.LogTelemetry, [_actionCommon_1.LogCategory.ActionLogs, logLevel, logTag, logMessage]);
    };
    Logger.logEventInternal = function (eventName, eventProps) {
        if (eventProps === void 0) { eventProps = null; }
        ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.LogTelemetry, [_actionCommon_1.LogCategory.ActionEvents, eventName, eventProps]);
    };
    Logger.logMetricInternal = function (metricState, metricName, metricProps, metricDuration) {
        if (metricProps === void 0) { metricProps = null; }
        if (metricDuration === void 0) { metricDuration = 0; }
        ActionHostInterface_1.Host.executeActionSDKApi(_actionCommon_1.ActionSdkCommand.LogTelemetry, [_actionCommon_1.LogCategory.ActionMetrics, metricState, metricName, metricProps, metricDuration]);
    };
    return Logger;
}(_actionCommon_1.ILogger));
exports.Logger = Logger;


/***/ }),

/***/ "../../ActionSDK/src/index.ts":
/*!**************************************************************************************************************!*\
  !*** C:/AssWorkstation/ActionsPlatform/src/KaizalaAggregationService/ActionResources/ActionSDK/src/index.ts ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Exporting all data models
var _actionCommon_1 = __webpack_require__(/*! @actionCommon */ "../../ActionCommon/src/index.ts");
exports.ActionInstanceColumnType = _actionCommon_1.ActionInstanceColumnType;
exports.ActionInstancePropertyType = _actionCommon_1.ActionInstancePropertyType;
exports.ActionInstancePropertyUpdateType = _actionCommon_1.ActionInstancePropertyUpdateType;
exports.ActionInstanceStatus = _actionCommon_1.ActionInstanceStatus;
exports.AttachmentType = _actionCommon_1.AttachmentType;
exports.ClientType = _actionCommon_1.ClientType;
exports.NotificationSettingMode = _actionCommon_1.NotificationSettingMode;
exports.Visibility = _actionCommon_1.Visibility;
exports.ActionEnvironment = _actionCommon_1.ActionEnvironment;
exports.ActionErrorCode = _actionCommon_1.ActionErrorCode;
exports.LogLevel = _actionCommon_1.LogLevel;
exports.NavBarMenuListType = _actionCommon_1.NavBarMenuListType;
exports.AMSClient = _actionCommon_1.AMSClient;
exports.AttachmentStatus = _actionCommon_1.AttachmentStatus;
exports.HttpStatusCode = _actionCommon_1.HttpStatusCode;
// Exporting utilities
var _actionCommon_2 = __webpack_require__(/*! @actionCommon */ "../../ActionCommon/src/index.ts");
exports.Utils = _actionCommon_2.Utils;
exports.ActionUtils = _actionCommon_2.ActionUtils;
// Exporting all apis
var APIs_1 = __webpack_require__(/*! ./APIs */ "../../ActionSDK/src/APIs.ts");
exports.APIs = APIs_1.APIs;
// Exporting logger
var Logger_1 = __webpack_require__(/*! ./Logger */ "../../ActionSDK/src/Logger.ts");
exports.Logger = Logger_1.Logger;
// Exporting localizer
var Localizer_1 = __webpack_require__(/*! ./Localizer */ "../../ActionSDK/src/Localizer.ts");
exports.Localizer = Localizer_1.Localizer;


/***/ })

}]);
//# sourceMappingURL=ActionSDK.587cb0fca319089346dc.js.map