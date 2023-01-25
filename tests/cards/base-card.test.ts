import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import ConstructorStandings from "../../src/cards/constructor-standings";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";

describe('Testing base-card file', () => {
    const parent = createMock<FormulaOneCard>({ 
        config: createMock<FormulaOneCardConfig>()
    });

    test.each`
    key | expected
    ${'constructor'}, ${'Constructor'}
    ${'points'}, ${'Punten'}
    `('Calling translation should return correct translation', ({ key, expected }) => { 
        
        parent.config.translations = {  
            "points" : "Punten"
        };
        const card = new ConstructorStandings(parent);

        expect(card.translation(key)).toBe(expected);
    })
});