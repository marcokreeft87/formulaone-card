import { LocalStorageItem } from '../types/formulaone-card-types';
import { getRefreshTime } from '../utils';
import { ConstructorStanding, DriverStanding, Race, RaceTable, Root, Season } from './models';

export default class ErgastClient  {

    baseUrl = 'https://ergast.com/api/f1';

    async GetSchedule(season: number) : Promise<Race[]> {      
      const data = await this.GetData<Root>(`${season}.json`, true, 72);

      return data?.MRData.RaceTable.Races;
    }

    async GetLastResult() : Promise<Race> {      
      const refreshCacheHours = getRefreshTime('current/last/results.json');
      const data = await this.GetData<Root>('current/last/results.json', true, refreshCacheHours);
      
      return data?.MRData.RaceTable.Races[0];
    }

    async GetDriverStandings() : Promise<DriverStanding[]> {      
      const refreshCacheHours = getRefreshTime('current/driverStandings.json');
      const data = await this.GetData<Root>('current/driverStandings.json', true, refreshCacheHours);

      return data?.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }

    async GetConstructorStandings() : Promise<ConstructorStanding[]> {      
      const refreshCacheHours = getRefreshTime('current/constructorStandings.json');
      const data = await this.GetData<Root>('current/constructorStandings.json', true, refreshCacheHours);

      return data?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    }
    
    async GetResults(season: number, round: number) : Promise<RaceTable> {      
      const data = await this.GetData<Root>(`${season}/${round}/results.json`, false, 0);

      return data?.MRData.RaceTable;
    }

    async GetSeasons() : Promise<Season[]> {
      const data = await this.GetData<Root>('seasons.json?limit=200', true, 72);

      return data.MRData.SeasonTable.Seasons;
    }

    async GetSeasonRaces(season: number) : Promise<Race[]> {
      console.log('races');
        const data = await this.GetData<Root>(`${season}.json`, true, 72);
        return data.MRData.RaceTable.Races;
    }

    async GetData<T>(endpoint: string, cacheResult: boolean, hoursBeforeInvalid: number) : Promise<T> {
      const localStorageData = localStorage.getItem(endpoint);
      if(localStorageData && cacheResult) {
        const item: LocalStorageItem = <LocalStorageItem>JSON.parse(localStorageData);

        const checkDate = new Date();
        checkDate.setHours(checkDate.getHours() - hoursBeforeInvalid);

        if(new Date(item.created) > checkDate) {
          return <T>JSON.parse(item.data);
        }
      }

      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        headers: {
          Accept: 'application/json',
        }
      });

      const data = await response.json();
        
      const item : LocalStorageItem = {
        data: JSON.stringify(data),
        created: new Date()
      }

      if(cacheResult) {          
        localStorage.setItem(endpoint, JSON.stringify(item));
      }

      return data;
    }
}