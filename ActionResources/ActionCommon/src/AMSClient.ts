import { Utils, Attachment } from '@actionCommon';

const IMAGE_OBJECT_TYPE = "pish/image";

// Task: 3726644 to remove this
const baseUrl = "https://absharstorage.blob.core.windows.net/createfromblob1/";

export class AMSClient {

    public static async uploadBlob(imageObj: Attachment, sasToken: string): Promise<string> {
        try {
            const blob = await fetch(imageObj.url).then(r => r.blob());
            const fileName = imageObj.id; // using id as filename to avoid duplicate names overwriting on blob
            const url = `${baseUrl}${fileName}${sasToken}`;
            const imageData = await Utils.readBlobAsync(blob);

            const uploadResponse = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "image/png",
                    "x-ms-client-version": "2015-02-21",
                    "x-ms-date": new Date().toString(),
                    "x-ms-blob-type": "BlockBlob"
                },
                body: imageData
            });
            if (uploadResponse.ok) {
                return `${baseUrl}${fileName}`;
            }
            else {
                return Promise.reject("Error in uploadBlob");
            }
        } catch (e) {
            return Promise.reject("Error in uploadBlob: " + (e.errorMessage) ? e.errorMessage : e);
        }
    }
}
