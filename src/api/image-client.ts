import { LocalStorageItem } from "../types/formulaone-card-types";
import * as packageJson from '../../package.json';

export default class ImageClient {

    // Get image by url with fetch and save to local storage for 24 hours base64 encoded
    GetImage(url: string): string {
        // Check local storage for image
        const localStorageData = localStorage.getItem(url);

        if (localStorageData) {
            const item: LocalStorageItem = <LocalStorageItem>JSON.parse(localStorageData);

            const checkDate = new Date();
            checkDate.setHours(checkDate.getHours() - (24 * 7 * 4));

            if (new Date(item.created) > checkDate) {
                return item.data;
            }
        }

        fetch(url)
            .then(response => response.blob())
            .then(imageBlob => {
                const reader = new FileReader();
                reader.readAsDataURL(imageBlob); 
                // istanbul ignore next
                reader.onloadend = function() {
                    const base64data = reader.result;

                    const item: LocalStorageItem = {
                        data: base64data as string,
                        created: new Date()
                    }
    
                    localStorage.setItem(url, JSON.stringify(item));
    
                    return item.data;
                }                
            });

        return url;
    }
}