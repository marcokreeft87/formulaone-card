import { Race } from '../../src/api/f1-models';
import { getCircuitName, getCircuitNameLegacy } from '../../src/utils';

const getRace = (country: string, locality: string) => ({
    Circuit: {
        Location: { country, locality }
    }
} as Race);

describe('Testing util file function getCircuitName', () => {
    test('Passing Japan should return expected circuit name', () => {         
        expect(getCircuitNameLegacy({
            country: 'Japan',
            lat: '',
            long: '',
            locality: ''
        })).toBe('Japan')
    }),
    test('Passing UAE should return expected circuit name', () => {         
        expect(getCircuitNameLegacy({
            country: 'UAE',
            lat: '',
            long: '',
            locality: ''
        })).toBe('Abu_Dhabi')
    })
    test('Passing Austin should return expected circuit name', () => {
        expect(getCircuitName(getRace('USA', 'Austin'))).toBe('Austin')
    }),
    test('Passing Las Vegas should return expected circuit name', () => {
        expect(getCircuitName(getRace('USA', 'Las Vegas'))).toBe('LasVegas')
    }),
    test('Passing Miami should return expected circuit name', () => {
        expect(getCircuitName(getRace('USA', 'Miami'))).toBe('Miami')
    }),
    test('Passing Spain should return the Madring circuit name', () => {
        expect(getCircuitName(getRace('Spain', 'Madrid'))).toBe('Madring')
    }),
    test('Passing Spain should return the Catalunya circuit name', () => {
        expect(getCircuitName(getRace('Spain', 'Montmeló'))).toBe('Catalunya')
    })
})
