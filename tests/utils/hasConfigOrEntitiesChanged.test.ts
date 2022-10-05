import { HomeAssistant } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";
import { PropertyValues } from "lit";
import { createMock } from "ts-auto-mock";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { hasConfigOrEntitiesChanged } from '../../src/utils';

describe('Testing util file function hasConfigOrEntitiesChanged', () => {
    const config : FormulaOneCardConfig = {
        type: ''
    };
    const hassEntity = createMock<HassEntity>();
    const hass = createMock<HomeAssistant>();

    test('Passing PropertyValues with config should return true', () => {
        const props : PropertyValues = new Map([['config', config]]);

        expect(hasConfigOrEntitiesChanged(config, props)).toBe(true);
    }),
    test('Passing PropertyValues empty and no oldHass should return true', () => {
        const props : PropertyValues = new Map();

        expect(hasConfigOrEntitiesChanged(config, props)).toBe(false);
    }),
    test('Passing PropertyValues with _hass and no changes should return false', () => {
        hassEntity.entity_id = 'sensor.test_entity';
        hassEntity.state = 'hide';
        hassEntity.attributes = {
            'show_state': 'show'
        }

        hass.states = { 
            'sensor.test_entity': hassEntity
        };

        config.hass = hass;
        const props : PropertyValues = new Map([['_hass', hass]]);
        
        expect(hasConfigOrEntitiesChanged(config, props)).toBe(false);
    }),
    test('Passing PropertyValues with _hass and changes should return true', () => {
        hassEntity.entity_id = 'sensor.test_entity';
        hassEntity.state = 'hide';

        const oldHass = hass;
        oldHass.states = { 
            'sensor.test_entity': hassEntity
        };

        const changedEntity = createMock<HassEntity>()
        changedEntity.entity_id = 'sensor.test_entity';
        changedEntity.state = 'show';
        const newHass = createMock<HomeAssistant>();
        newHass.states = { 
            'sensor.test_entity': changedEntity
        };

        config.hass = newHass;
        config.sensor = hassEntity.entity_id;
        const props : PropertyValues = new Map([['_hass', oldHass]]);
        
        expect(hasConfigOrEntitiesChanged(config, props)).toBe(true);
    }),
    test('Passing PropertyValues with _hass and no changes should return false', () => {
        hassEntity.entity_id = 'sensor.test_entity';
        hassEntity.state = 'hide';

        hass.states = { 
            'sensor.test_entity': hassEntity
        };

        config.hass = hass;
        config.sensor = hassEntity.entity_id;
        const props : PropertyValues = new Map([['_hass', hass]]);
        
        expect(hasConfigOrEntitiesChanged(config, props)).toBe(false);
    })
})