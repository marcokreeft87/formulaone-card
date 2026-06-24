import { LocalStorageItem } from "../types/formulaone-card-types";
import { Country } from "../types/rest-country-types";
import { ClientBase } from "./client-base";

export default class RestCountryClient extends ClientBase {
    private readonly apiKey: string;
    
    baseUrl = 'https://api.restcountries.com/countries/v5';
    allEndpoint = 'response_fields=names.common,names.alternates,demonyms,population,flag,nativeName&pretty=1';

    constructor(apiKey: string) {
        super();

        this.apiKey = apiKey;
    }

    async GetAll() : Promise<Country[]> {   
        if (!this.apiKey) {
            return [];
        }
        
        return await this.GetData<Country[]>(this.allEndpoint, true, 730, {
            Authorization: `Bearer ${this.apiKey}`,
        });
    }
    
    GetCountriesFromLocalStorage() : Country[] {
        if (!this.apiKey) {
            return [];
        }

        const localStorageData = localStorage.getItem(this.allEndpoint);

        if(localStorageData) {
            const item: LocalStorageItem = <LocalStorageItem>JSON.parse(localStorageData);
            return <Country[]>JSON.parse(item.data);
        }
        return [];
    }
}