import { getRefreshTime } from '../utils';
import { ClientBase } from './client-base';
import { ConstructorStanding, DriverStanding, Race, RaceTable, Root, Season } from './f1-models';

export default class ErgastClient extends ClientBase {

    baseUrl = 'https://ergast.com/api/f1';

    async GetSchedule(season: number) : Promise<Race[]> {      
      const data = await this.GetData<Root>(`${season}.json`, true, 72);

      return data.MRData.RaceTable.Races;
    }

    async GetLastResult() : Promise<Race> {      
      const refreshCacheHours = getRefreshTime('current/last/results.json');
      const data = await this.GetData<Root>('current/last/results.json', true, refreshCacheHours);
      
      return data.MRData.RaceTable.Races[0];
    }

    async GetDriverStandings() : Promise<DriverStanding[]> {      
      const refreshCacheHours = getRefreshTime('current/driverStandings.json');
      const data = await this.GetData<Root>('current/driverStandings.json', true, refreshCacheHours);

      return data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }

    async GetConstructorStandings() : Promise<ConstructorStanding[]> {      
      const refreshCacheHours = getRefreshTime('current/constructorStandings.json');
      const data = await this.GetData<Root>('current/constructorStandings.json', true, refreshCacheHours);

      return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    }

    async GetSprintResults(season: number, round: number) : Promise<RaceTable> {
      const data = await this.GetData<Root>(`${season}/${round}/sprint.json`, false, 0);

      return data.MRData.RaceTable;
    }

    async GetQualifyingResults(season: number, round: number) : Promise<RaceTable> {
      const data = await this.GetData<Root>(`${season}/${round}/qualifying.json`, false, 0);

      return data.MRData.RaceTable;
    }
    
    async GetResults(season: number, round: number) : Promise<RaceTable> {      
      const data = await this.GetData<Root>(`${season}/${round}/results.json`, false, 0);

      return data.MRData.RaceTable;
    }

    async GetSeasons() : Promise<Season[]> {
      const data = await this.GetData<Root>('seasons.json?limit=200', true, 72);
      
      return data.MRData.SeasonTable.Seasons;
    }

    async GetSeasonRaces(season: number) : Promise<Race[]> {
      const data = await this.GetData<Root>(`${season}.json`, true, 72);

      return data.MRData.RaceTable.Races;
    }

    async GetLastYearsResults(circuitName: string) : Promise<Race> {
      
      // Get schedule of last year
      const lastYear = new Date().getFullYear() - 1;
      const data = await this.GetData<Root>(`${lastYear}.json`, true, 72);

      // Get the index of the circuit on the schedule of last year
      const raceRound = data.MRData.RaceTable.Races.findIndex((race: Race) => {
        return race.Circuit.circuitName === circuitName;
      }) + 1; 

      // Get the results of the last year race
      const results = await this.GetData<Root>(`${lastYear}/${raceRound}/results.json`, false, 0);

      return results.MRData.RaceTable.Races[0];
    }

    async RefreshCache() {
      await this.GetData<Root>('current.json', true, 0);
      await this.GetData<Root>('current/last/results.json', true, 0);
      await this.GetData<Root>('current/driverStandings.json', true, 0);
      await this.GetData<Root>('current/constructorStandings.json', true, 0);
    }
}