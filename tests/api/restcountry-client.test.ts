import RestCountryClient from "../../src/api/restcountry-client";
import { LocalStorageItem } from "../../src/types/formulaone-card-types";
import LocalStorageMock from "../testdata/localStorageMock";
import * as countryData from '../testdata/countries.json'

describe('Testing restcountry client file', () => {

    const client = new RestCountryClient();    
    const localStorageMock = new LocalStorageMock();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    test('Calling GetCountriesFromLocalStorage should return correct data', () => {   
        localStorageMock.clear();     

        localStorageMock.setItem('all', JSON.stringify({ data: JSON.stringify(countryData), created: new Date() } as LocalStorageItem));

        const countries = client.GetCountriesFromLocalStorage();
        expect(JSON.stringify(countries)).toMatch(JSON.stringify(countryData));
    }),
    test('Calling GetCountriesFromLocalStorage should return correct data without localstorage', () => {   
        localStorageMock.clear();     

        const countries = client.GetCountriesFromLocalStorage();
        expect(JSON.stringify(countries)).toMatch(JSON.stringify([]));
    })
})