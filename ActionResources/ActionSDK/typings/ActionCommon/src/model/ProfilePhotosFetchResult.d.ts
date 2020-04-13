import { Base64ProfilePhoto } from "./Base64ProfilePhoto";
export interface ProfilePhotosFetchResult {
    userIdToPhotoMap: {
        [key: string]: Base64ProfilePhoto;
    };
    userIdsWithoutPhoto?: string[];
}
