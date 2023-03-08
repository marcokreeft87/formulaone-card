// Mocks
import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";

// Models
import WeatherClient from "../../src/api/weather-client";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";

// Importing test data
import ConstructorStandings from "../../src/cards/constructor-standings";

describe('Testing base-card file', () => {
    const parent = createMock<FormulaOneCard>({ 
        config: createMock<FormulaOneCardConfig>()
    });

    test.each`
    key | expected
    ${'constructor'}, ${'Constructor'}
    ${'points'}, ${'Punten'}
    `('Calling translation should return correct translation', ({ key, expected }) => { 
        // Arrange
        parent.config.translations = {  
            "points" : "Punten"
        };

        // Act
        const card = new ConstructorStandings(parent);

        // Assert
        expect(card.translation(key)).toBe(expected);
    }),
    test('Given config without weater_options when weatherOptions is called then default weatherOptions are returned', () => {
        // Arrange
        parent.config.weather_options = {};

        // Act
        const card = new ConstructorStandings(parent);

        // Assert
        expect(card.weatherClient).toMatchObject(new WeatherClient(''));

    }),
    test('Given config without weater_options when weatherOptions is called then default weatherOptions are returned', () => {
        // Arrange
        parent.config.weather_options = { api_key: 'undefined' };

        // Act
        const card = new ConstructorStandings(parent);

        // Assert
        expect(card.weatherClient).toMatchObject(new WeatherClient('undefined'));
    })
});