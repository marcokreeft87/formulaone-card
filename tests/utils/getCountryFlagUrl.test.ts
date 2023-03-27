// Mocks
import { createMock } from 'ts-auto-mock';

import { getCountryFlagByName } from '../../src/utils';
import * as countries from '../testdata/countries.json';
import RestCountryClient from '../../src/api/restcountry-client';
import { Country } from '../../src/types/rest-country-types';
import ImageClient from '../../src/api/image-client';
import { BaseCard } from '../../src/cards/base-card';

describe('Testing util file function getCountryFlagUrl', () => {
    
    const card = createMock<BaseCard>();
    beforeAll(() => {
        jest.spyOn(RestCountryClient.prototype, 'GetCountriesFromLocalStorage').mockImplementation(() => {
            return countries as Country[];
        });

        jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(() => null);
        jest.spyOn(ImageClient.prototype, 'GetImage').mockImplementation((url: string) => {
            return '';
        });
    });

    test('Passing USA should return expected flag url', () => {         
        expect(getCountryFlagByName(card, 'USA')).toBe('')
    }),
    test('Passing UAE should return expected flag url', () => {         
        expect(getCountryFlagByName(card, 'UAE')).toBe('')
    })
})