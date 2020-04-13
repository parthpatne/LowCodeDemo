import { Base64ProfilePhoto } from "./Base64ProfilePhoto";
export interface UserProfile {
    id: string;
    displayName: string;
    email?: string;
    profilePhoto?: Base64ProfilePhoto;
}
