import { checkConfig } from '../../src/utils';
import { FormulaOneCardConfig } from '../../src/types/formulaone-card-types';

describe('Testing util file function checkConfig', () => {
    test('Passing empty config should throw error', () => {   
        const config: FormulaOneCardConfig = {
            type: ''
        }

        expect(() => checkConfig(config)).toThrowError('Please define FormulaOne card type (card_type).');
    })
})

