import { HomeAssistant } from "custom-card-helpers";
import { HTMLTemplateResult } from "lit";
import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import { Race } from "../../src/api/f1-models";
import { BaseCard } from "../../src/cards/base-card";
import { renderHeader } from "../../src/utils";
import { MRData } from '../testdata/results.json'
import { getRenderString } from "../utils";
import * as customCardHelper from "custom-card-helpers";
import { FormulaOneCardType } from "../../src/types/formulaone-card-types";
import RestCountryClient from "../../src/api/restcountry-client";
import { Country } from "../../src/types/rest-country-types";
import * as countries from '../testdata/countries.json'

describe('Testing util file function renderHeader', () => {

    const card = createMock<BaseCard>();
    card.hass = createMock<HomeAssistant>();
    card.parent = createMock<FormulaOneCard>();
    const lastRace = <Race>MRData.RaceTable.Races[0];
    
    beforeAll(() => {
        jest.spyOn(RestCountryClient.prototype, 'GetCountriesFromLocalStorage').mockImplementation(() => {
            return countries as Country[];
        });
    });
    
    test('Calling renderHeader with image not clickable', async () => { 
        card.config.image_clickable = undefined;
        
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2 class=""><img height="25" src="">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="" @action=_handleAction .actionHandler= class="" /><br>`);
    }),
    test('Calling renderHeader with clickable image ', () => { 
        card.config.image_clickable = true;
        card.config.f1_font = true;
        
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(card.config.actions).toMatchObject({
            tap_action: {
              action: 'url',
              url_path: 'http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit'
            }
          });

        expect(htmlResult).toMatch(`<h2 class="formulaone-font"><img height="25" src="">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="" @action=_handleAction .actionHandler= class=" clickable" /><br>`);
    }),
    test('Calling renderHeader with image not clickable and card countdown', async () => { 
        card.config.image_clickable = undefined;
        card.config.card_type = FormulaOneCardType.Countdown;
        
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<img width="100%" src="" @action=_handleAction .actionHandler= class=" clickable" /><br>`);
    }),
    test('Calling renderHeader with actions', () => {

        // handleAction
        const spy = jest.spyOn(customCardHelper, 'handleAction');

        card.config.actions = {
            tap_action: {
                action: 'navigate',
                navigation_path: '/lovelace/0',
            },
            hold_action: {
                action: 'navigate',
                navigation_path: '/lovelace/1',
            },
            double_tap_action: {
                action: 'navigate',
                navigation_path: '/lovelace/2',
            }
        }
        
        const result = renderHeader(card, lastRace);

        // eslint-disable-next-line @typescript-eslint/ban-types
        const actionHandler = (result.values[1] as HTMLTemplateResult).values[1] as Function;
        actionHandler({ detail: { action: 'tap' } });
        actionHandler({ detail: { action: 'double_tap' } });
        actionHandler({ detail: { action: 'hold' } });
        
        expect(customCardHelper.handleAction).toBeCalledTimes(3);

        spy.mockClear();
    }),
    test('Calling renderHeader with actions', () => {

        // handleAction
        const spy = jest.spyOn(customCardHelper, 'handleAction');

        card.config.actions = {
            tap_action: {
                action: 'navigate',
                navigation_path: '/lovelace/0',
            },
            hold_action: {
                action: 'navigate',
                navigation_path: '/lovelace/1',
            },
            double_tap_action: {
                action: 'navigate',
                navigation_path: '/lovelace/2',
            }
        }
        
        const result = renderHeader(card, lastRace, true);

        // eslint-disable-next-line @typescript-eslint/ban-types
        const actionHandler = (result.values[1] as HTMLTemplateResult).values[1] as Function;
        actionHandler({ detail: { action: 'tap' } });
        actionHandler({ detail: { action: 'double_tap' } });
        actionHandler({ detail: { action: 'hold' } });
        
        expect(customCardHelper.handleAction).toBeCalledTimes(0);

        spy.mockClear();
    }),
    test('Calling renderHeader with config hide_tracklayout true', () => {
        card.config.hide_tracklayout = true;
        card.config.card_type = FormulaOneCardType.Results;
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2 class="formulaone-font"><img height="25" src="">&nbsp; 17 : Singapore Grand Prix</h2>`);
    }),
    test('Calling renderHeader with Miami with image not clickable', async () => { 
        card.config.image_clickable = undefined;
        card.config.hide_tracklayout = false;
        lastRace.Circuit.Location.country = "USA";
        lastRace.Circuit.Location.locality = "Miami";
        
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2 class="formulaone-font"><img height="25" src="">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="" @action=_handleAction .actionHandler= class=" clickable" /><br>`);
    })
});
