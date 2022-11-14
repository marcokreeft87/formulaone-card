import { getCircuitName } from '../../src/utils';

describe('Testing util file function getCircuitName', () => {
    test('Passing Japan should return expected circuit name', () => {         
        expect(getCircuitName('Japan')).toBe('Japan')
    }),
    test('Passing UAE should return expected circuit name', () => {         
        expect(getCircuitName('UAE')).toBe('Abu_Dhabi')
    })
})

