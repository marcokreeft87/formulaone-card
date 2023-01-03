//https://ergast.com/mrd/
import axios from 'axios';
import { Race, RaceTable, Root, Season } from './models';

export default class ErgastClient  {

    //client: rm.RestClient;
    baseUrl = 'https://ergast.com/api/f1';

    constructor() {
        //this.client = new rm.RestClient('formulaone-card', this.baseUrl);       
        axios.defaults.baseURL = this.baseUrl;
    }
    
    async GetResults(season: number, round: number) : Promise<RaceTable> {
        //const result = await this.client.get<Root>(`${season}/${round}/results.json`);
        const { data, status } = await axios.get<Root>(
            `${season}/${round}/results.json`,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );

        return data.MRData.RaceTable;
    }

    async GetSeasons() : Promise<Season[]> {
        // const result = await this.client.get<Root>('seasons.json');
        // const result2 = await this.client.get<Root>('seasons.json').then(result => console.log(result));
        
        //return result.result.MRData.SeasonTable.Seasons;
        const { data, status } = await axios.get<Root>(
            'seasons.json?limit=200',
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );

        return data.MRData.SeasonTable.Seasons;
    }

    async GetSeasonRaces(season: number) : Promise<Race[]> {
        //const result = await this.client.get<Root>(`${season}.json`);
        const { data, status } = await axios.get<Root>(
            `${season}.json`,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );
        
        //return result.result.MRData.RaceTable.Races;
        return data.MRData.RaceTable.Races;
    }
}