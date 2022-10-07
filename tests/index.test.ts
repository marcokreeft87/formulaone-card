import { HomeAssistant } from 'custom-card-helpers';
import { createMock } from 'ts-auto-mock';
import FormulaOneCard from '../src/index';
import { ConstructorStanding, DriverStanding, FormulaOneCardConfig, FormulaOneCardType, Race } from '../src/types/formulaone-card-types';
import { getRenderString } from './utils';
import { HassEntity } from 'home-assistant-js-websocket';
import { PropertyValues } from 'lit';

describe('Testing index file function setConfig', () => {
    const card = new FormulaOneCard();
    const hass = createMock<HomeAssistant>();
    const hassEntity = createMock<HassEntity>();

    test('Calling render without hass and config should return empty html', () => {   

        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('');
    }),
    test('Passing empty config should throw error', () => {   
        const config: FormulaOneCardConfig = {
            type: ''
        }

        expect(() => card.setConfig(config)).toThrowError('Please define FormulaOne card type (card_type).');
    }),
    test('Calling render with hass and config ConstructorStandings should return warning', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.ConstructorStandings,
            sensor: 'sensor.test_sensor'
        }

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<hui-warning>TypeError: Cannot read properties of undefined (reading \'attributes\')</hui-warning>');
    }),    
    test('Calling render with hass and config ConstructorStandings should return expected html', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.ConstructorStandings,
            sensor: 'sensor.test_sensor_constructors'
        }

        hassEntity.attributes['data'] = [] as ConstructorStanding[];
        hass.states = {
            'sensor.test_sensor_constructors': hassEntity
        };

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    }),    
    test('Calling render with hass and config DriverStanding should return expected html', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.DriverStandings,
            sensor: 'sensor.test_sensor_drivers'
        }

        hassEntity.attributes['data'] = [] as DriverStanding[];
        hass.states = {
            'sensor.test_sensor_drivers': hassEntity
        };

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50" colspan="2">&nbsp;</th> <th>Driver</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    }),    
    test('Calling render with hass and config LastResult should return expected html', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.LastResult,
            sensor: 'sensor.test_sensor_last_result'
        }

        hassEntity.attributes['data'] = {} as Race;
        hass.states = {
            'sensor.test_sensor_last_result': hassEntity
        };

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<hui-warning>TypeError: Cannot read properties of undefined (reading \'Location\')</hui-warning>');
    }),    
    test('Calling render with hass and config NextRace should return expected html', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.NextRace,
            sensor: 'sensor.test_sensor_races'
        }

        hassEntity.attributes['next_race'] = {} as Race;
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<hui-warning>TypeError: Cannot read properties of undefined (reading \'date\')</hui-warning>');
    }),    
    test('Calling render with hass and config Schedule should return expected html', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.Schedule,
            sensor: 'sensor.test_sensor_races'
        }

        hassEntity.attributes['data'] = [] as Race[];
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    }),
    test('Calling render with hass and config Schedule without title should return expected html', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            card_type: FormulaOneCardType.Schedule,
            sensor: 'sensor.test_sensor_races'
        }

        hassEntity.attributes['data'] = [] as Race[];
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    }),
    test('Calling shouldUpdate with config should return true', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.Schedule,
            sensor: 'sensor.test_sensor_races'
        }
        const props : PropertyValues = new Map([['config', config]]);        

        const result = card['shouldUpdate'](props);

        expect(result).toBeTruthy();
    })
})

