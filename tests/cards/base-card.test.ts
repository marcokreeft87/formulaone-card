import { createMock } from "ts-auto-mock";
import ConstructorStandings from "../../src/cards/constructor-standings";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";

describe('Testing base-card file', () => {
    const config = createMock<FormulaOneCardConfig>();

    test.each`
    key | expected
    ${'constructor'}, ${'Constructor'}
    ${'points'}, ${'Punten'}
    `('Calling translation should return correct translation', ({ key, expected }) => { 
        
        config.translations = {  
            "points" : "Punten"
        };
        const card = new ConstructorStandings(config);

        expect(card.translation(key)).toBe(expected);
    })
});