import { TeamsChannel } from "./TeamsChannel";

export interface TeamsGroup {
    /** Teams id, shouldn't be changed */
    id: string;

    /** Display name of group */
    dispNm: string;

    /** List of channels */
    channelList: TeamsChannel[];
}