import { getCountryFlagByName, getCountryFlagByNationality } from '../../src/utils';
import * as countries from '../testdata/countries.json';
import { ImageConstants } from '../../src/lib/constants';
import RestCountryClient from '../../src/api/restcountry-client';
import { Country } from '../../src/types/rest-country-types';

describe('Testing util file function getCountryFlagUrl', () => {
    
    beforeAll(() => {
        jest.spyOn(RestCountryClient.prototype, 'GetCountriesFromLocalStorage').mockImplementation(() => {
            return countries as Country[];
        });
    });

    test('Passing USA should return expected flag url', () => {         
        expect(getCountryFlagByName('USA')).toBe(`${ImageConstants.FlagCDN}us.png`)
    }),
    test('Passing UAE should return expected flag url', () => {         
        expect(getCountryFlagByName('UAE')).toBe(`${ImageConstants.FlagCDN}ae.png`)
    })//,

    // countries.forEach(country => {
    //     if(country.Code == "HK") {
    //         country.Code = "CN";
    //     }

    //     test(`Passing ${country.Nationality} to getCountryFlagByNationality should return correct flag url`, () => {
    //         expect(getCountryFlagByNationality(country.Nationality)).toBe(`${ImageConstants.FlagCDN}${country.Code.toLowerCase()}.png`)
    //     })

    //     test(`Passing ${country.Country} to getCountryFlagByName should return correct flag url`, () => {
    //         expect(getCountryFlagByName(country.Country)).toBe(`${ImageConstants.FlagCDN}${country.Code.toLowerCase()}.png`)
    //     })
    // });
})