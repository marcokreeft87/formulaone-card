// Models
import RestCountryClient from "../../src/api/restcountry-client";
import { countries } from "../../src/data/countries";

describe('Testing restcountry client file', () => {

    const client = new RestCountryClient();

    test('GetAll should return static country data', () => {
        const result = client.GetAll();
        expect(result).toBe(countries);
        expect(result.length).toBeGreaterThan(0);
    }),
    test('GetCountriesFromLocalStorage should return static country data', () => {
        const result = client.GetCountriesFromLocalStorage();
        expect(result).toBe(countries);
    }),
    test('Country data should contain Italy with correct demonym', () => {
        const result = client.GetAll();
        const italy = result.filter(c => c.name === 'Italy');
        expect(italy.length).toBe(1);
        expect(italy[0].demonym).toBe('Italian');
        expect(italy[0].flags.png).toContain('flagcdn.com');
    })
})
