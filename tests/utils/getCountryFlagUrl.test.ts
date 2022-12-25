import { getCountryFlagUrl } from '../../src/utils';

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
})