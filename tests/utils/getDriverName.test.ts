import { createMock } from 'ts-auto-mock';
import { Driver, FormulaOneCardConfig } from '../../src/types/formulaone-card-types';
import { getDriverName } from '../../src/utils';

describe('Testing util file function getDriverName', () => {
    const config = createMock<FormulaOneCardConfig>();
    const driver: Driver = {
        familyName: 'Verstappen',
        givenName: 'Max',
        permanentNumber: '1',
        driverId: '',
        code: 'VER',
        url: '',
        dateOfBirth: '',
        nationality: ''
    };

    test('Passing driver and config with show_carnumber should return expected driver name', () => {            
        expect(getDriverName(driver, config)).toBe('Max Verstappen')
    }),
    test('Passing driver and config with show_carnumber should return expected driver name', () => { 
        config.show_carnumber = true;           
        expect(getDriverName(driver, config)).toBe('Max Verstappen #1')
    })
})

