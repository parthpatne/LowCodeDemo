import { Base64ProfilePhoto } from "./Base64ProfilePhoto";

export interface UserProfile {
    id: string;
    displayName: string;
    profilePhoto?: Base64ProfilePhoto;
}