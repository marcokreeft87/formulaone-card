import { LocalStorageItem } from "../types/formulaone-card-types";
import { Country } from "../types/rest-country-types";
import { ClientBase } from "./client-base";

export default class RestCountryClient extends ClientBase {
    
    baseUrl = 'https://restcountries.com/v2';

    async GetAll() : Promise<Country[]> {   
        return await this.GetData<Country[]>('all', true, 730);
    }
    
    GetCountriesFromLocalStorage() : Country[] {
        const localStorageData = localStorage.getItem('all');
        if(localStorageData) {
            const item: LocalStorageItem = <LocalStorageItem>JSON.parse(localStorageData);
            return <Country[]>JSON.parse(item.data);
        }
        return [];
    }
}