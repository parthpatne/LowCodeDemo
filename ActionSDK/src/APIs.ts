import { Host } from "./ActionHostInterface";
import {
    ActionSdkCommand,
    ActionInstance,
    ActionInstanceRow,
    ActionInstanceSummary,
    ActionInstanceRowsFetchResult,
    ActionInstanceUpdateInfo,
    UserProfile,
    UserProfilesFetchResult,
    ProfilePhotosFetchResult,
    MemberCount,
    NonResponder,
    ActionContext,
    NavBarMenuItem,
    FilteredActionInstanceRequest,
    FilteredActionInstanceResponse,
    FilteredTemplateActionInstanceResponse,
    ConversationInfo,
    TeamsGroup,
    GetChannelsForTeamsResponse
} from "@actionCommon";

export namespace APIs {
    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    export async function createActionInstance(actionInstance: ActionInstance, viewData?: any): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.CreateActionInstance, [actionInstance, viewData]);
    }

    /**
    * Creates a new Action instance along with the given rows
    * @param {ActionInstance} actionInstance
    * @param {ActionInstanceRow[]} actionInstanceRows
    * @return promise returning either success or ActionError
    */
    export async function createActionInstanceWithRows(actionInstance: ActionInstance, actionInstanceRows: ActionInstanceRow[], viewData?: any): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.CreateActionInstanceWithRows, [actionInstance, actionInstanceRows, viewData]);
    }

    /**
    * Gets the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either ActionInstance or ActionError
    */
    export async function getActionInstance(actionInstanceId: string): Promise<ActionInstance> {
        return Host.executeActionSDKApi<ActionInstance>(ActionSdkCommand.GetActionInstance, [actionInstanceId]);
    }

    /**
    * Updates the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @param {ActionInstanceUpdateInfo} actionInstanceUpdateInfo
    * @return promise returning either success or ActionError
    */
    export async function updateActionInstance(actionInstanceId: string, actionInstanceUpdateInfo: ActionInstanceUpdateInfo): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.UpdateActionInstance, [actionInstanceId, actionInstanceUpdateInfo]);
    }

    /**
    * Deletes the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either success or ActionError
    */
    export async function deleteActionInstance(actionInstanceId: string): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.DeleteActionInstance, [actionInstanceId]);
    }

    /**
    * Sends a reminder for the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either success or ActionError
    */
    export async function sendActionInstanceReminder(actionInstanceId: string): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.SendActionInstanceReminder, [actionInstanceId]);
    }

    /**
    * Creates or updates Action instance rows
    * @param {string} actionInstanceId ID of the action instance
    * @param {ActionInstanceRow[]} actionInstanceRows An array of ActionInstanceRow instances
    * @return promise returning either success or ActionError
    */
    export async function createOrUpdateActionInstanceRows(actionInstanceId: string, actionInstanceRows: ActionInstanceRow[]): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.CreateOrUpdateActionInstanceRows, [actionInstanceId, actionInstanceRows]);
    }

    /**
    * Gets an Action instance row corresponding to the given id
    * @param {string} actionInstanceId ID of the action instance
    * @param {string} actionInstanceRowId ID of the action instance row to fetch
    * @return promise returning either ActionInstanceRow or ActionError
    */
    export async function getActionInstanceRow(actionInstanceId: string, actionInstanceRowId: string): Promise<ActionInstanceRow> {
        return Host.executeActionSDKApi<ActionInstanceRow>(ActionSdkCommand.GetActionInstanceRow, [actionInstanceId, actionInstanceRowId]);
    }

    /**
    * Gets Action instance rows
    * @param {string} actionInstanceId ID of the action instance
    * @param {string} creatorId ID of the creator of the action instance rows to fetch
    * @param {string} continuationToken continuation token to handle paged results
    * @param {number} pageSize size of the page (number of results to fetch in one call)
    * @return promise returning either an array of ActionInstanceRow or ActionError
    */
    export async function getActionInstanceRows(actionInstanceId: string, creatorId: string, continuationToken: string, pageSize: number): Promise<ActionInstanceRowsFetchResult> {
        // TODO: The following implementation will be udpated once continuationToken support is added on service
        return Host.executeActionSDKApi<ActionInstanceRowsFetchResult>(ActionSdkCommand.GetActionInstanceRows, [actionInstanceId, creatorId, continuationToken, pageSize]);
    }

    /**
    * Deletes an Action instance row
    * @param {string} actionInstanceId ID of the action instance
    * @param {string} actionInstanceRowId ID of the action instance row to delete
    * @return promise returning either success or ActionError
    */
    export async function deleteActionInstanceRow(actionInstanceId: string, actionInstanceRowId: string): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.DeleteActionInstanceRow, [actionInstanceId, actionInstanceRowId]);
    }

    /**
    * Gets the summary of the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @param {boolean} isShortSummary flag denoting if aggregates are to be returned with the summary
    * @return promise returning either ActionInstanceSummary or ActionError
    */
    export async function getActionInstanceSummary(actionInstanceId: string, isShortSummary: boolean = true): Promise<ActionInstanceSummary> {
        return Host.executeActionSDKApi<ActionInstanceSummary>(ActionSdkCommand.GetActionInstanceSummary, [actionInstanceId, isShortSummary]);
    }

    /**
    * Downloads the Action instance result result
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either success or ActionError
    */
    export async function downloadActionInstanceResult(actionInstanceId: string, fileName: string = null): Promise<any> {
        return Host.executeActionSDKApi<any>(ActionSdkCommand.DownloadActionInstanceResult, [actionInstanceId, fileName]);
    }

    /**
    * Gets non responders of the current Action instance
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either an array of non-responders or ActionError
    */
    export async function getActionInstanceNonResponders(actionInstanceId: string): Promise<NonResponder> {
        return Host.executeActionSDKApi<NonResponder>(ActionSdkCommand.GetActionInstanceNonResponoders, [actionInstanceId]);
    }

    /**
    * Gets the members count of the current conversation
    * @param {ConversationInfo} conversationInfo conversation details
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either a result or ActionError
    */
    export async function getConversationMembersCount(conversationInfo: ConversationInfo, actionInstanceId: string): Promise<MemberCount> {
        return Host.executeActionSDKApi<MemberCount>(ActionSdkCommand.GetConversationMembersCount, [conversationInfo, actionInstanceId]);
    }

    /**
    * Gets the members of the current conversation
    * @param {ConversationInfo} conversationInfo conversation details
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either an array of members or ActionError
    */
    export async function getConversationMembers(conversationInfo: ConversationInfo, actionInstanceId: string): Promise<UserProfile[]> {
        return Host.executeActionSDKApi<UserProfile[]>(ActionSdkCommand.GetConversationMembers, [conversationInfo, actionInstanceId]);
    }

    /**
    * Gets the details of the given user ids
    * @param {string[]} userIDs array of user ids
    * @param {string} actionInstanceId ID of the action instance
    * @return promise returning either UserProfilesFetchResult or ActionError
    */
    export async function getUserProfiles(userIDs: string[], actionInstanceId: string): Promise<UserProfilesFetchResult> {
        return Host.executeActionSDKApi<UserProfilesFetchResult>(ActionSdkCommand.GetUserProfiles, [userIDs, actionInstanceId]);
    }

    /**
    * Gets profile photos of the given user ids
    * @param {string[]} userIDs array of user ids
    * @return promise returning either ProfilePhotosFetchResult or ActionError
    */
    export async function getUserProfilePhotos(userIDs: string[]): Promise<ProfilePhotosFetchResult> {
        return Host.executeActionSDKApi<ProfilePhotosFetchResult>(ActionSdkCommand.GetUserProfilePhotos, [userIDs]);
    }

    /**
    * Sets the nav bar items when the host's client type is mobile
    * @param {NavBarMenuItem[]} menuItems list of NavBarMenuItems
    * @param {(id: string) => void} callback callback function to be called when menu item is tapped
    * @return promise returning either success or ActionError
    */
    export async function setNavBarMenuItems(menuItems: NavBarMenuItem[], callback: (id: string) => void): Promise<boolean> {
        return Host.registerActionSDKCallback(ActionSdkCommand.SetNavBarMenuItems, [menuItems], callback);
    }

    /**
    * Get current Action context
    * @return promise returning either ActionContext or ActionError
    */
    export async function getCurrentContext(): Promise<ActionContext> {
        return Host.executeActionSDKApi<ActionContext>(ActionSdkCommand.GetCurrentContext);
    }

    /**
    * Dismiss the current screen.
    * @return promise returning either success or ActionError
    */
    export async function dismissScreen(): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.DismissScreen);
    }

    /**
    * Show the diagnostic view containing diagnostic logs
    * @return promise returning either success or ActionError
    */
    export async function showDiagnosticView(): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.ShowDiagnosticView);
    }

    /**
     * To notify app loaded to hide loading indicator
     * @return promise returning false if already called once else true.
     */
    export async function hideLoadingIndicator(): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.HideLoadingIndicator, []);
    }

    /**
    * Log given props and time to render view. Must be called only once.
    * It will log only one time in one instance of Task module.
    * @return promise returning either success or ActionError
    */
    let actionViewLoadCalled = false;
    export async function actionViewDidLoad(success: boolean, props: any = null): Promise<boolean> {
        if (actionViewLoadCalled) {
            return;
        }
        actionViewLoadCalled = true;
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.ActionViewDidLoad, [success, props]);
    }

    /**
    * Registers a handler for the hardware back button in Android
    * @param {() => void} handler handler method to be invoked when back button is pressed
    * @return promise returning either success or ActionError
    */
    export async function registerBackButtonHandler(handler: () => void): Promise<boolean> {
        return Host.registerActionSDKCallback(ActionSdkCommand.RegisterBackButtonHandler, [], handler);
    }

    /**
    * Call server to get list of templates from server.
    * @param string filter required for getting list of templates
    * @return promise returning either List of ActionInstances or ActionError
    */
    export async function getTemplateActions(filter: FilteredActionInstanceRequest): Promise<FilteredTemplateActionInstanceResponse> {
        return Host.executeActionSDKApi<FilteredTemplateActionInstanceResponse>(ActionSdkCommand.GetTemplateActions, [filter]);
    }

    /**
    * Call server to get list of user actions from server.
    * @param string filter required for getting list of Active action instance
    * @return promise returning either List of ActionInstances or ActionError
    */
    export async function getActionInstances(filter: FilteredActionInstanceRequest): Promise<FilteredActionInstanceResponse> {
        return Host.executeActionSDKApi<FilteredActionInstanceResponse>(ActionSdkCommand.GetActionInstances, [filter]);
    }

    /**
     * Call server to get list of user actions from server.
     * @param string filter required for getting list of Drafts
     * @return promise returning either List of ActionInstances or ActionError
     */
    export async function getDraftActionInstances(filter: FilteredActionInstanceRequest): Promise<FilteredActionInstanceResponse> {
        return Host.executeActionSDKApi<FilteredActionInstanceResponse>(ActionSdkCommand.GetDraftActionInstances, [filter]);
    }


    /**
    * Call server to create a action as draft
    * @param actionInstance action instance object to create
    * @return promise returning either ActionInstances or ActionError
    */
    export async function saveActionInstanceDraft(actionInstance: ActionInstance): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.SaveActionInstanceDraft, [actionInstance]);
    }

    /**
     * Call server to update the draft
     * @param actionInstance action instance object to update
     * @return promise returning success or ActionError
     */
    export async function updateActionInstanceDraft(actionInstance: ActionInstance): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.UpdateActionInstanceDraft, [actionInstance]);
    }

    /**
     * send draft
     * @return promise returning list of groups and channels
     */
    export async function promoteDraftToAction(actionInstanceId: string): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.PromoteDraftToAction, [actionInstanceId]);
    }

    /**
     * Creates a new Action instance
     * @param {ActionInstance} actionInstance
     * @return promise returning either success or ActionError
     */
    export async function createActionInstanceNoBot(actionInstance: ActionInstance): Promise<boolean> {
        return Host.executeActionSDKApi<boolean>(ActionSdkCommand.CreateActionInstanceNoBot, [actionInstance]);
    }

    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    export async function getJoinedTeams(): Promise<TeamsGroup[]> {
        return Host.executeActionSDKApi<TeamsGroup[]>(ActionSdkCommand.GetJoinedTeams);
    }

    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    export async function getListOfChannelsForGroups(listOfGroups: Array<string>): Promise<GetChannelsForTeamsResponse> {
        return Host.executeActionSDKApi<GetChannelsForTeamsResponse>(ActionSdkCommand.GetListOfChannelsForGroups, [listOfGroups]);
    }
}
