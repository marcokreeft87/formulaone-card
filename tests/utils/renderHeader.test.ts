import { Race } from "../../src/api/models";
import { ImageConstants } from "../../src/lib/constants";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { renderHeader } from "../../src/utils";
import { MRData } from '../testdata/results.json'
import { getRenderString } from "../utils";

describe('Testing util file function renderHeader', () => {

    const config : FormulaOneCardConfig = {
        type: ''
    };    
    const lastRace = <Race>MRData.RaceTable.Races[0];
    
    test('Calling renderHeader with image not clickable', async () => { 
        config.image_clickable = undefined;
        
        const result = renderHeader(config, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2><img height="25" src="${ImageConstants.FlagCDN}sg.png">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="${ImageConstants.F1CDN}Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br>`);
    }),
    test('Calling renderHeader with clickable image ', () => { 
        config.image_clickable = true;
        
        const result = renderHeader(config, lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(`<h2><img height="25" src="${ImageConstants.FlagCDN}sg.png">&nbsp; 17 : Singapore Grand Prix</h2> <a target="_new" href="http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit"><img width="100%" src="${ImageConstants.F1CDN}Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"></a><br>`);
    })
});
