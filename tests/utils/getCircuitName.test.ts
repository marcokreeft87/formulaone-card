import { getCircuitName } from '../../src/utils';

describe('Testing util file function getCircuitName', () => {
    test('Passing Japan should return expected circuit name', () => {         
        expect(getCircuitName({
            country: 'Japan',
            lat: '',
            long: '',
            locality: ''
        })).toBe('Japan')
    }),
    test('Passing UAE should return expected circuit name', () => {         
        expect(getCircuitName({
            country: 'UAE',
            lat: '',
            long: '',
            locality: ''
        })).toBe('Abu_Dhabi')
    })
})

