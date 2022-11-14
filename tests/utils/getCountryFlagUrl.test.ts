import { getCountryFlagUrl } from '../../src/utils';

describe('Testing util file function getCountryFlagUrl', () => {
    test('Passing Japan should return expected flag url', () => {         
        expect(getCountryFlagUrl('Japan')).toBe('https://www.countries-ofthe-world.com/flags-normal/flag-of-Japan.png')
    }),
    test('Passing USA should return expected flag url', () => {         
        expect(getCountryFlagUrl('USA')).toBe('https://www.countries-ofthe-world.com/flags-normal/flag-of-United-States-of-America.png')
    }),
    test('Passing UAE should return expected flag url', () => {         
        expect(getCountryFlagUrl('UAE')).toBe('https://www.countries-ofthe-world.com/flags-normal/flag-of-United-Arab-Emirates.png')
    }),
    test('Passing Saudi Arabia should return expected flag url', () => {         
        expect(getCountryFlagUrl('Saudi-Arabia')).toBe('https://www.countries-ofthe-world.com/flags-normal/flag-of-Saudi-Arabia.png')
    })
})

