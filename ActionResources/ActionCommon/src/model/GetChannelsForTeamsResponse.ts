import { TeamsChannel } from "./TeamsChannel";

export interface GetChannelsForTeamsResponse {
    /** teams ID to list of channel ID map */
    teamIdToChannelDataMap: { [key: string]: TeamsChannel[] };

    /** List of teams whose channels are not found */
    teamChannelsNotFound: string[];
}