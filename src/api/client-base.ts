import { LocalStorageItem } from "../types/formulaone-card-types";

export abstract class ClientBase {
    abstract baseUrl: string;

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