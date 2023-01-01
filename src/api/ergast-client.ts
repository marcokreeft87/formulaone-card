//https://ergast.com/mrd/
import * as rm from 'typed-rest-client/RestClient';
import { Race, RaceTable, Root, Season } from './models';

export default class ErgastClient  {

    client: rm.RestClient;
    baseUrl = 'https://ergast.com/api/f1';

    constructor() {
        this.client = new rm.RestClient('formulaone-card', this.baseUrl);        
    }
    
    async GetResults(season: number, round: number) : Promise<RaceTable> {
        const result = await this.client.get<Root>(`/${season}/${round}/results.json`)

        return result.result.MRData.RaceTable;
    }

    async GetSeasons() : Promise<Season[]> {
        const result = await this.client.get<Root>('seasons.json');
        
        return result.result.MRData.SeasonTable.Seasons;
    }

    async GetSeasonRaces(season: number) : Promise<Race[]> {
        const result = await this.client.get<Root>(`${season}.json`);
        
        return result.result.MRData.RaceTable.Races;
    }
}