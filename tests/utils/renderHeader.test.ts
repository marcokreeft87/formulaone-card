import { HomeAssistant } from "custom-card-helpers";
import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import { Race } from "../../src/api/models";
import { BaseCard } from "../../src/cards/base-card";
import { ImageConstants } from "../../src/lib/constants";
import { renderHeader } from "../../src/utils";
import { MRData } from '../testdata/results.json'
import { getRenderString } from "../utils";

describe('Testing util file function renderHeader', () => {

    const card = createMock<BaseCard>();
    card.hass = createMock<HomeAssistant>();
    card.parent = createMock<FormulaOneCard>();
    const lastRace = <Race>MRData.RaceTable.Races[0];
    
    test('Calling renderHeader with image not clickable', async () => { 
        card.config.image_clickable = undefined;
        
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2><img height="25" src="${ImageConstants.FlagCDN}sg.png">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="${ImageConstants.F1CDN}Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br>`);
    }),
    test('Calling renderHeader with clickable image ', () => { 
        card.config.image_clickable = true;
        
        const result = renderHeader(card, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2><img height="25" src="${ImageConstants.FlagCDN}sg.png">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="${ImageConstants.F1CDN}Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class=" clickable" /><br>`);
    })
});