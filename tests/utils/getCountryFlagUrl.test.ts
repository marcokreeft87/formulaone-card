import { getCountryFlagByName, getCountryFlagByNationality, getCountryFlagUrl } from '../../src/utils';
import * as countries from '../../src/data/countries.json';

describe('Testing util file function getCountryFlagUrl', () => {

    test('Passing Japan should return expected flag url', () => {         
        expect(getCountryFlagUrl('Japan')).toBe('https://flagcdn.com/w40/japan.png')
    }),
    test('Passing USA should return expected flag url', () => {         
        expect(getCountryFlagUrl('USA')).toBe('https://flagcdn.com/w40/us.png')
    }),
    test('Passing UAE should return expected flag url', () => {         
        expect(getCountryFlagUrl('UAE')).toBe('https://flagcdn.com/w40/ae.png')
    }),
    test('Passing Saudi Arabia should return expected flag url', () => {         
        expect(getCountryFlagUrl('Saudi-Arabia')).toBe('https://flagcdn.com/w40/saudi-arabia.png')
    })

    countries.forEach(country => {
        if(country.Code == "HK") {
            country.Code = "CN";
        }

        test(`Passing ${country.Nationality} to getCountryFlagByNationality should return correct flag url`, () => {
            expect(getCountryFlagByNationality(country.Nationality)).toBe(`https://flagcdn.com/w40/${country.Code.toLowerCase()}.png`)
        })

        test(`Passing ${country.Country} to getCountryFlagByName should return correct flag url`, () => {
            expect(getCountryFlagByName(country.Country)).toBe(`https://flagcdn.com/w40/${country.Code.toLowerCase()}.png`)
        })
    });
})