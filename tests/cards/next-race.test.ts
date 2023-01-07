import NextRace from '../../src/cards/next-race';
import { createMock } from 'ts-auto-mock';
import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { getRenderString, getRenderStringAsync } from '../utils';
import { MRData } from '../testdata/schedule.json'
import { FormulaOneCardConfig } from '../../src/types/formulaone-card-types';
import { Mrdata, Root } from '../../src/api/models';
import ErgastClient from '../../src/api/ergast-client';
import { getApiErrorMessage, getEndOfSeasonMessage } from '../../src/utils';

describe('Testing next-race file', () => {
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }
    
    const config = createMock<FormulaOneCardConfig>();

    test('Calling render with api returning data', async () => {   
        const card = new NextRace(hass, config);

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        jest.useRealTimers();
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br> </td> </tr> <tr><td>Date</td><td>20-03-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:00</td></tr> <tr><td>Race</td><td>1</td><td>&nbsp;</td><td>Practice 2</td><td align="right">vr 16:00</td></tr> <tr><td>Race name</td><td>Bahrain Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">za 13:00</td></tr> <tr><td>Circuit name</td><td>Bahrain International Circuit</td><td>&nbsp;</td><td>Qualifying</td><td align="right">za 16:00</td></tr> <tr><td>Location</td><td>Bahrain</td><td>&nbsp;</td><td>Sprint</td><td align="right">-</td></tr> <tr><td>City</td><td>Sakhir</td><td>&nbsp;</td><td>Race</td><td align="right">zo 16:00</td></tr> </tbody> </table>');
    }),
    test('Calling render with api returning data at end of season', async () => {   
        const card = new NextRace(hass, config);

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getEndOfSeasonMessage('Season is over. See you next year!'));

        jest.useRealTimers();
        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling render with api not returning data', async () => {   
        const card = new NextRace(hass, config);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getApiErrorMessage('next race'));

        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling renderheader with api returning data and image clickable', () => { 
        config.image_clickable = true;

        const card = new NextRace(hass, config);
        
        const result = card.renderHeader(MRData.RaceTable.Races[0]);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Bahrain_International_Circuit"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"></a><br>');
    }),
    test('Calling render with api returning data on sprintrace', async () => {   
        const card = new NextRace(hass, config);

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 6, 6)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        jest.useRealTimers();
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2><img height="25" src="https://flagcdn.com/w40/as.png">&nbsp; 11 : Austrian Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Red_Bull_Ring"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png.transform/7col/image.png"></a><br> </td> </tr> <tr><td>Date</td><td>10-07-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:30</td></tr> <tr><td>Race</td><td>11</td><td>&nbsp;</td><td>Practice 2</td><td align="right">za 12:30</td></tr> <tr><td>Race name</td><td>Austrian Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">-</td></tr> <tr><td>Circuit name</td><td>Red Bull Ring</td><td>&nbsp;</td><td>Qualifying</td><td align="right">vr 17:00</td></tr> <tr><td>Location</td><td>Austria</td><td>&nbsp;</td><td>Sprint</td><td align="right">za 16:30</td></tr> <tr><td>City</td><td>Spielberg</td><td>&nbsp;</td><td>Race</td><td align="right">zo 15:00</td></tr> </tbody> </table>');
    }),
    test('Calling cardSize with hass and sensor', () => { 
        const card = new NextRace(hass, config);
        expect(card.cardSize()).toBe(8);
    })
});