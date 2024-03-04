import { SportsTimesRace, SportsTimesRoot } from '../types/sportstimes-types';
import { ClientBase } from './client-base';

export class SportsTimesClient extends ClientBase {
    baseUrl = 'https://raw.githubusercontent.com/sportstimes';
  
    async GetSchedule(season: number) : Promise<SportsTimesRace[]> {      
        const data = await this.GetData<SportsTimesRoot>(`f1/main/_db/f1/${season}.json`, true, 72);

        console.log(data);

        return data.races;
    }
}