import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import WeatherClient from "../../src/api/weather-client";
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
    }),
    test('Given config without weater_options when weatherOptions is called then default weatherOptions are returned', () => {

        parent.config.weather_options = {};
        const card = new ConstructorStandings(parent);

        expect(card.weatherClient).toMatchObject(new WeatherClient(''));

    }),
    test('Given config without weater_options when weatherOptions is called then default weatherOptions are returned', () => {

        parent.config.weather_options = { api_key: 'undefined' };
        const card = new ConstructorStandings(parent);

        expect(card.weatherClient).toMatchObject(new WeatherClient('undefined'));

    })

    // test the constructor of the base card
    //test('Given config with weater_options when weatherOptions is called then weatherOptions are returned', () => {

});