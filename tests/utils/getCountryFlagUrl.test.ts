import { getCountryFlagByName } from '../../src/utils';
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
    })
})