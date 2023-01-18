import { HomeAssistant } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";
import { PropertyValues } from "lit";
import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import { BaseCard } from "../../src/cards/base-card";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { hasConfigOrCardValuesChanged } from '../../src/utils';

describe('Testing util file function hasConfigOrEntitiesChanged', () => {
    const config : FormulaOneCardConfig = {
        type: ''
    };    
    const card = createMock<FormulaOneCard>();
    const baseCard = createMock<BaseCard>();

    test('Passing PropertyValues with config should return true', () => {
        const props : PropertyValues = new Map([['config', config]]);

        expect(hasConfigOrCardValuesChanged(card, props)).toBe(true);
    }),
    test('Passing PropertyValues empty should return false', () => {
        const props : PropertyValues = new Map();

        expect(hasConfigOrCardValuesChanged(card, props)).toBe(false);
    }),
    test('Passing PropertyValues config and card should return true', () => {
        card.cardValues = new Map([['test', 'test']]);
        const props : PropertyValues = new Map([['card', baseCard]]);

        expect(hasConfigOrCardValuesChanged(card, props)).toBe(true);
    }),
    test('Passing PropertyValues config and cardValues should return true', () => {
        const props : PropertyValues = new Map([['cardValues', new Map([['cardValues', 'test']])]]);

        expect(hasConfigOrCardValuesChanged(card, props)).toBe(true);
    })
})