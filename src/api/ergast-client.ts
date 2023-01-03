//https://ergast.com/mrd/
import axios, { AxiosInstance } from 'axios';
import { ConstructorStanding, DriverStanding, Race, RaceTable, Root, Season } from './models';

export default class ErgastClient  {

    baseUrl = 'https://ergast.com/api/f1';
    instance: AxiosInstance;

    constructor() {
        //axios.defaults.baseURL = this.baseUrl;

        this.instance = axios.create({
          baseURL: this.baseUrl,
          //headers: { 'Cache-Control': 'max-age=3600' }
        });
    }

    async GetSchedule() : Promise<Race[]> {      
      const data = await this.GetData('current.json');

      return data.MRData.RaceTable.Races;
    }

    async GetLastResult() : Promise<Race> {      
      const data = await this.GetData('current/last/results.json');

      return data.MRData.RaceTable.Races[0];
    }

    async GetDriverStandings() : Promise<DriverStanding[]> {      
      const data = await this.GetData('current/driverStandings.json');

      return data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }

    async GetConstructorStandings() : Promise<ConstructorStanding[]> {      
      const data = await this.GetData('current/constructorStandings.json');

      return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    }
    
    async GetResults(season: number, round: number) : Promise<RaceTable> {      
      const data = await this.GetData(`${season}/${round}/results.json`);

      return data.MRData.RaceTable;
    }

    async GetSeasons() : Promise<Season[]> {
      const data = await this.GetData('seasons.json?limit=200');

      return data.MRData.SeasonTable.Seasons;
    }

    async GetSeasonRaces(season: number) : Promise<Race[]> {
        const data = await this.GetData( `${season}.json`);
        return data.MRData.RaceTable.Races;
    }

    async GetData(endpoint: string) : Promise<Root> {
       const { data } = await this.instance.get<Root>(
            endpoint,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );

        return data;
    }
}