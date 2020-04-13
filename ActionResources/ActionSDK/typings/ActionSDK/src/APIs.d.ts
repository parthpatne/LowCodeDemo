import { ActionInstance, ActionInstanceRow, ActionInstanceSummary, ActionInstanceRowsFetchResult, ActionInstanceUpdateInfo, UserProfile, UserProfilesFetchResult, ProfilePhotosFetchResult, MemberCount, NonResponder, ActionContext } from "@actionCommon";
export declare namespace APIs {
    /**
    * Creates a new Action instance
    * @param {ActionInstance} actionInstance
    * @return promise returning either success or ActionError
    */
    function createActionInstance(actionInstance: ActionInstance): Promise<boolean>;
    /**
    * Creates a new Action instance along with the given rows
    * @param {ActionInstance} actionInstance
    * @param {ActionInstanceRow[]} actionInstanceRows
    * @return promise returning either success or ActionError
    */
    function createActionInstanceWithRows(actionInstance: ActionInstance, actionInstanceRows: ActionInstanceRow[]): Promise<boolean>;
    /**
    * Gets the current Action instance
    * @return promise returning either ActionInstance or ActionError
    */
    function getActionInstance(): Promise<ActionInstance>;
    /**
    * Updates the current Action instance
    * @param {ActionInstanceUpdateInfo} actionInstanceUpdateInfo
    * @return promise returning either success or ActionError
    */
    function udpateActionInstance(actionInstanceUpdateInfo: ActionInstanceUpdateInfo): Promise<boolean>;
    /**
    * Deletes the current Action instance
    * @return promise returning either success or ActionError
    */
    function deleteActionInstance(): Promise<boolean>;
    /**
    * Sends a reminder for the current Action instance
    * @return promise returning either success or ActionError
    */
    function sendActionInstanceReminder(): Promise<boolean>;
    /**
    * Creates or updates Action instance rows
    * @param {ActionInstanceRow[]} actionInstanceRows An array of ActionInstanceRow instances
    * @return promise returning either success or ActionError
    */
    function createOrUpdateActionInstanceRows(actionInstanceRows: ActionInstanceRow[]): Promise<boolean>;
    /**
    * Gets an Action instance row corresponding to the given id
    * @param {string} actionInstanceRowId ID of the action instance row to fetch
    * @return promise returning either ActionInstanceRow or ActionError
    */
    function getActionInstanceRow(actionInstanceRowId: string): Promise<ActionInstanceRow>;
    /**
    * Gets Action instance rows
    * @param {string} creatorId ID of the creator of the action instance rows to fetch
    * @param {string} continuationToken continuation token to handle paged results
    * @param {number} pageSize size of the page (number of results to fetch in one call)
    * @return promise returning either an array of ActionInstanceRow or ActionError
    */
    function getActionInstanceRows(creatorId: string, continuationToken: string, pageSize: number): Promise<ActionInstanceRowsFetchResult>;
    function getActionInstanceRowsTest(creatorId: string, continuationToken: string, pageSize: number): Promise<ActionInstanceRowsFetchResult>;
    /**
    * Deletes an Action instance row
    * @param {string} actionInstanceRowId ID of the action instance row to delete
    * @return promise returning either success or ActionError
    */
    function deleteActionInstanceRow(actionInstanceRowId: string): Promise<boolean>;
    /**
    * Gets the summary of the current Action instance
    * @param {boolean} isShortSummary flag denoting if aggregates are to be returned with the summary
    * @return promise returning either ActionInstanceSummary or ActionError
    */
    function getActionInstanceSummary(isShortSummary?: boolean): Promise<ActionInstanceSummary>;
    /**
    * Gets the Action instance result data in csv format
    * @return promise returning either result or ActionError
    */
    function getActionInstanceData(): Promise<any>;
    /**
    * Gets non responders of the current Action instance
    * @return promise returning either an array of non-responders or ActionError
    */
    function getActionInstanceNonResponders(): Promise<NonResponder>;
    /**
    * Gets the members count of the current conversation
    * @return promise returning either a result or ActionError
    */
    function getConversationMembersCount(): Promise<MemberCount>;
    /**
    * Gets the members of the current conversation
    * @return promise returning either an array of members or ActionError
    */
    function getConversationMembers(): Promise<UserProfile[]>;
    /**
    * Gets the details of the given user ids
    * @param {string[]} userIDs array of user ids
    * @return promise returning either UserProfilesFetchResult or ActionError
    */
    function getUserProfiles(userIDs: string[]): Promise<UserProfilesFetchResult>;
    /**
    * Gets profile photos of the given user ids
    * @param {string[]} userIDs array of user ids
    * @return promise returning either ProfilePhotosFetchResult or ActionError
    */
    function getUserProfilePhotos(userIDs: string[]): Promise<ProfilePhotosFetchResult>;
    /**
    * Sets the nav bar item when the host's client type is mobile
    * @param {string} title title of the item
    * @param {boolean} enabled flag denoting if the item is enabled
    * @param {string} id identifier of the item
    * @return promise returning either the item id when it is clicked or ActionError
    */
    function setNavBarMenuItem(title: string, enabled: boolean, id: string): Promise<string>;
    /**
    * Get current Action context
    * @return promise returning either ActionContext or ActionError
    */
    function getCurrentContext(): Promise<ActionContext>;
    /**
    * Dismiss the current screen.
    * @return promise returning either success or ActionError
    */
    function dismissScreen(): Promise<boolean>;
    /**
    * Show the diagnostic view containing diagnostic logs
    * @return promise returning either success or ActionError
    */
    function showDiagnosticView(): Promise<boolean>;
}
