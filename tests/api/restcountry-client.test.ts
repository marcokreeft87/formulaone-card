// Mocks
import fetchMock from "jest-fetch-mock";
import LocalStorageMock from "../testdata/localStorageMock";

// Models
import RestCountryClient from "../../src/api/restcountry-client";
import { LocalStorageItem } from "../../src/types/formulaone-card-types";

// Importing test data
import * as countryData from '../testdata/countries.json'

describe('Testing restcountry client file', () => {

    const client = new RestCountryClient();    
    const localStorageMock = new LocalStorageMock();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    test('Calling GetCountriesFromLocalStorage should return correct data', () => {   
         // Arrange
        localStorageMock.clear();     
        localStorageMock.setItem('all', JSON.stringify({ data: JSON.stringify(countryData), created: new Date() } as LocalStorageItem));

        // Act
        const countries = client.GetCountriesFromLocalStorage();

        // Assert
        expect(JSON.stringify(countries)).toMatch(JSON.stringify(countryData));
    }),
    test('Calling GetCountriesFromLocalStorage should return correct data without localstorage', () => {   
        // Arrange
        localStorageMock.clear();     

        // Act
        const countries = client.GetCountriesFromLocalStorage();

        // Assert
        expect(JSON.stringify(countries)).toMatch(JSON.stringify([]));
    }),
    test('Calling GetAll should return correct data', async () => { 
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify(countryData));

        // Act
        const result = await client.GetAll();

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(countryData));
    })
})