import { LocalStorageItem } from "../types/formulaone-card-types";
import { ConstructorStanding, DriverStanding, Race } from "./f1-models";

export interface IClient {
  GetConstructorStandings(): Promise<ConstructorStanding[]>;

  GetConstructorStandingsForSeason(season: number | undefined) : Promise<ConstructorStanding[]>;

  GetSchedule(season: number) : Promise<Race[]>;    
  
  GetLastResult() : Promise<Race>;
  
  GetDriverStandings() : Promise<DriverStanding[]>;

  GetDriverStandingsForSeason(season: number | undefined) : Promise<DriverStanding[]>;

  RefreshCache(): void;
}

export abstract class ClientBase {  
  abstract baseUrl: string;

  async GetData<T>(endpoint: string, cacheResult: boolean, hoursBeforeInvalid: number): Promise<T> {
    const localStorageData = localStorage.getItem(endpoint);

    if (localStorageData && cacheResult) {
      const item: LocalStorageItem = <LocalStorageItem>JSON.parse(localStorageData);

      const checkDate = new Date();
      checkDate.setHours(checkDate.getHours() - hoursBeforeInvalid);

      if (new Date(item.created) > checkDate) {
        return <T>JSON.parse(item.data);
      }
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      headers: {
        Accept: 'application/json',
      }
    });

    if (!response || !response.ok) {
      return Promise.reject(response);
    }

    const data = await response.json();

    const item: LocalStorageItem = {
      data: JSON.stringify(data),
      created: new Date()
    }

    if (cacheResult) {
      localStorage.setItem(endpoint, JSON.stringify(item));
    }

    return data;
  }
}