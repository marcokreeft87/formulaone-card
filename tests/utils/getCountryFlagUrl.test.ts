import { getCountryFlagByName, getCountryFlagByNationality, getCountryFlagUrl } from '../../src/utils';
import * as countries from '../../src/data/countries.json';
import { ImageConstants } from '../../src/lib/constants';

describe('Testing util file function getCountryFlagUrl', () => {

    test('Passing Japan should return expected flag url', () => {         
        expect(getCountryFlagUrl('Japan')).toBe(`${ImageConstants.FlagCDN}japan.png`)
    }),
    test('Passing USA should return expected flag url', () => {         
        expect(getCountryFlagUrl('USA')).toBe(`${ImageConstants.FlagCDN}us.png`)
    }),
    test('Passing UAE should return expected flag url', () => {         
        expect(getCountryFlagUrl('UAE')).toBe(`${ImageConstants.FlagCDN}ae.png`)
    }),
    test('Passing USA should return expected flag url', () => {         
        expect(getCountryFlagByName('USA')).toBe(`${ImageConstants.FlagCDN}us.png`)
    }),
    test('Passing UAE should return expected flag url', () => {         
        expect(getCountryFlagByName('UAE')).toBe(`${ImageConstants.FlagCDN}ae.png`)
    }),
    test('Passing Saudi Arabia should return expected flag url', () => {         
        expect(getCountryFlagUrl('Saudi-Arabia')).toBe(`${ImageConstants.FlagCDN}saudi-arabia.png`)
    })

    countries.forEach(country => {
        if(country.Code == "HK") {
            country.Code = "CN";
        }

        test(`Passing ${country.Nationality} to getCountryFlagByNationality should return correct flag url`, () => {
            expect(getCountryFlagByNationality(country.Nationality)).toBe(`${ImageConstants.FlagCDN}${country.Code.toLowerCase()}.png`)
        })

        test(`Passing ${country.Country} to getCountryFlagByName should return correct flag url`, () => {
            expect(getCountryFlagByName(country.Country)).toBe(`${ImageConstants.FlagCDN}${country.Code.toLowerCase()}.png`)
        })
    });
})