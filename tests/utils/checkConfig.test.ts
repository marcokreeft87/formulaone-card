import { checkConfig } from '../../src/utils';
import { FormulaOneCardConfig, FormulaOneCardType } from '../../src/types/formulaone-card-types';

describe('Testing util file function checkConfig', () => {
    test('Passing empty config should throw error', () => {   
        const config: FormulaOneCardConfig = {
            type: ''
        }

        expect(() => checkConfig(config)).toThrowError('Please define FormulaOne card type (card_type).');
    }),
    test('Passing empty config should throw error', () => {   
        const config: FormulaOneCardConfig = {
            type: '',
            card_type: FormulaOneCardType.ConstructorStandings
        }

        expect(() => checkConfig(config)).toThrowError('Please define FormulaOne sensor.');
    }),
    test('Passing empty config should throw error', () => {   
        const config: FormulaOneCardConfig = {
            type: '',
            card_type: FormulaOneCardType.ConstructorStandings,
            sensor: 'sensor.test_sensor'
        }

        expect(() => checkConfig(config)).not.toThrowError('Please define FormulaOne sensor.');
    })
})

