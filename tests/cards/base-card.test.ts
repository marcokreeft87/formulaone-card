import { HomeAssistant } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";
import { createMock } from "ts-auto-mock";
import ConstructorStandings from "../../src/cards/constructor-standings";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";

describe('Testing base-card file', () => {
    const hass = createMock<HomeAssistant>();
    const hassEntity = createMock<HassEntity>();
    const config = createMock<FormulaOneCardConfig>();

    test.each`
    key | expected
    ${'constructor'}, ${'Constructor'}
    ${'points'}, ${'Punten'}
    `('Calling translation should return correct translation', ({ key, expected }) => { 
        
        config.translations = {  
            "points" : "Punten"
        };

        hassEntity.attributes['data'] = undefined;
        hass.states = {
            'sensor.test_sensor_constructors': hassEntity
        };

        const card = new ConstructorStandings('sensor.test_sensor_constructors', hass, config);

        expect(card.translation(key)).toBe(expected);
    })
});