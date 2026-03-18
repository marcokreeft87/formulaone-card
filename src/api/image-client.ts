import { ImageConstants } from "../lib/constants";
import { LocalStorageItem } from "../types/formulaone-card-types";
import { getCircuitName, getCircuitNameLegacy } from "../utils";
import { Race } from "./f1-models";

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

    GetTeamLogoImage(teamName: string, selectedSeason: number): string {
        
        teamName = teamName.toLocaleLowerCase().replace('_', '-');
        if (selectedSeason < 2026) {
            const exceptions = [{ teamName: 'red-bull', corrected: 'red-bull-racing'}, { teamName: 'alfa', corrected: 'alfa-romeo'}, { teamName: 'haas', corrected: 'haas-f1-team'}, { teamName: 'sauber', corrected: 'kick-sauber'}];

            const exception = exceptions.filter(exception => exception.teamName == teamName);
            if(exception.length > 0)
            {
                teamName = exception[0].corrected;
            }

            return this.GetImage(`${ImageConstants.TeamLogoCDNLegacy}/2024/${teamName.toLowerCase()}-logo.png.transform/2col-retina/image.png`);
        }

        const exceptions = [{ teamName: 'red-bull', corrected: 'redbullracing'}, { teamName: 'rb', corrected: 'racingbulls'}, { teamName: 'haas', corrected: 'haasf1team'}, { teamName: 'aston-martin', corrected: 'astonmartin'}];

        const exception = exceptions.filter(exception => exception.teamName == teamName);
        if(exception.length > 0)
        {
            teamName = exception[0].corrected;
        }

        return this.GetImage(`${ImageConstants.TeamLogoCDN}2026/${teamName.toLowerCase()}/2026${teamName.toLowerCase()}logo.webp`);
    }

    GetTrackLayoutImage(race: Race): string {
        const circuitName = getCircuitNameLegacy(race.Circuit.Location);
        const year = parseInt(race.season);

        if (year < 2026) {
            return this.GetImage(`${ImageConstants.F1CDNLegacy}/${circuitName}_Circuit`);
        }

        return this.GetImage(`${ImageConstants.F1CDN}${getCircuitName(race).toLowerCase()}detailed.webp`);
    }
}