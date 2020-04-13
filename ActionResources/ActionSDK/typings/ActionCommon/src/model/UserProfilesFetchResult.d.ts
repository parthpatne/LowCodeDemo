import { UserProfile } from "./UserProfile";
export interface UserProfilesFetchResult {
    userIdToProfileMap: {
        [key: string]: UserProfile;
    };
    userIdsNotFound?: string[];
}
