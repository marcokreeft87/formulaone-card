import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import ErgastClient from "../../src/api/ergast-client";
import { Mrdata, Race, Root } from "../../src/api/models";
import Results from "../../src/cards/results";
import { CardProperties, FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { MRData as resultData } from '../testdata/results.json'
import { MRData as seasonData } from '../testdata/seasons.json'
import { MRData as raceData } from '../testdata/schedule.json'
import { getRenderString, getRenderStringAsync } from "../utils";
import { HTMLTemplateResult } from "lit";

describe('Testing results file', () => {
    const config = createMock<FormulaOneCardConfig>();
    const parent = createMock<FormulaOneCard>();
    const lastRace = <Race>resultData.RaceTable.Races[0];

    beforeAll(() => {
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementation((_endpoint) => {
            if(_endpoint === '2022/17/results.json`') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>resultData });
                });
            }
    
            if(_endpoint === 'seasons.json?limit=200') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>seasonData });
                });
            }
    
            return new Promise<Root>((resolve) => {
                resolve({ MRData : <Mrdata>raceData });
            });
        });
    });
    
    
    parent.properties = new Map<string, unknown>();

    test('Calling render without selecting season', async () => {   
        const card = new Results(config, parent);
                
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0">Select race</option> </select> </td> </tr></table>');
    }),
    test('Calling render with selecting season', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979' });
        const card = new Results(config, parent);
                
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);


        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1950" ?selected=>1950</option><option value="1951" ?selected=>1951</option><option value="1952" ?selected=>1952</option><option value="1953" ?selected=>1953</option><option value="1954" ?selected=>1954</option><option value="1955" ?selected=>1955</option><option value="1956" ?selected=>1956</option><option value="1957" ?selected=>1957</option><option value="1958" ?selected=>1958</option><option value="1959" ?selected=>1959</option><option value="1960" ?selected=>1960</option><option value="1961" ?selected=>1961</option><option value="1962" ?selected=>1962</option><option value="1963" ?selected=>1963</option><option value="1964" ?selected=>1964</option><option value="1965" ?selected=>1965</option><option value="1966" ?selected=>1966</option><option value="1967" ?selected=>1967</option><option value="1968" ?selected=>1968</option><option value="1969" ?selected=>1969</option><option value="1970" ?selected=>1970</option><option value="1971" ?selected=>1971</option><option value="1972" ?selected=>1972</option><option value="1973" ?selected=>1973</option><option value="1974" ?selected=>1974</option><option value="1975" ?selected=>1975</option><option value="1976" ?selected=>1976</option><option value="1977" ?selected=>1977</option><option value="1978" ?selected=>1978</option><option value="1979" ?selected=>1979</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0">Select race</option> </select> </td> </tr></table>');
    }),    
    test('Calling selectedSeasonChanged should change parent properties', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979' });
        const card = new Results(config, parent);
                
        const result = card.render();

        const directive = result.values[1] as HTMLTemplateResult;
        const promise = directive.values[0] as Promise<unknown>;
        const promiseResult = await promise;

        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedSeasonChangedFn = (promiseResult as HTMLTemplateResult).values[0] as Function;
        selectedSeasonChangedFn({ target: { value: '2022' } });

        const properties = card.parent.properties.get('cardValues') as CardProperties;
        expect(properties).toMatchObject({ selectedSeason: '2022' } as CardProperties);
    }),
    test('Calling selectedRaceChanged should change parent properties', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979' });
        const card = new Results(config, parent);
                
        const result = card.render();

        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedRaceChangedFn = result.values[3] as Function;
        selectedRaceChangedFn({ target: { value: '17' } });

        const properties = card.parent.properties.get('cardValues') as CardProperties;
        expect(properties).toMatchObject({ selectedSeason: '1979', selectedRound: '17' } as CardProperties);
    }),
    test('Calling renderHeader with image not clickable', async () => { 
        config.image_clickable = undefined;

        const card = new Results(config, parent);
        
        const result = card.renderHeader(lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br>');
    }),
    test('Calling renderHeader with clickable image ', () => { 
        config.image_clickable = true;

        const card = new Results(config, parent);
        
        const result = card.renderHeader(lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"></a><br>');
    }),
    test('Calling cardSize with hass and sensor', () => { 
        const card = new Results(config, parent);
        expect(card.cardSize()).toBe(11);
    })
});