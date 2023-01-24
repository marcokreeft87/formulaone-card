import { createMock } from "ts-auto-mock";
import Countdown from "../../src/cards/countdown";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { getRenderStringAsync } from "../utils";
import { MRData } from '../testdata/schedule.json'
import { MRData as resultData } from '../testdata/results.json'
import ErgastClient from "../../src/api/ergast-client";
import { Mrdata, Race, Root } from "../../src/api/models";
import { HTMLTemplateResult } from "lit";
import { HomeAssistant, NumberFormat, TimeFormat } from "custom-card-helpers";
import FormulaOneCard from "../../src";

describe('Testing countdown file', () => {
    const parent = createMock<FormulaOneCard>({ 
        config: createMock<FormulaOneCardConfig>(),
    });
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }
    parent._hass = hass;
    
    const config = createMock<FormulaOneCardConfig>();
    const card = new Countdown(parent);
    const race: Race = {
        season: '2022',
        round: '22',
        url: 'https://en.wikipedia.org/wiki/2022_Formula_One_World_Championship',
        raceName: 'Season is over. See you next year!',
        Circuit: {
            circuitId: 'bahrain',
            url: 'https://en.wikipedia.org/wiki/Bahrain_International_Circuit',
            circuitName: 'Bahrain International Circuit',
            Location: {
                lat: '26.0325',
                long: '50.5106',
                locality: 'Sakhir',
                country: 'Bahrain'
            }
        },
        date: '2022-12-30',
        time: '13:00:00Z',
        FirstPractice: {
            date: '2022-12-30',
            time: '10:00:00Z'
        },
        SecondPractice: {
            date: '2022-12-30',
            time: '14:00:00Z'
        },
        ThirdPractice: {
            date: '2022-12-31',
            time: '11:00:00Z'
        },
        Qualifying:  {
            date: '2022-12-31',
            time: '14:00:00Z'                
        }
    };

    beforeAll(() => {
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementation((_endpoint) => {
            if(_endpoint === '2022/2/results.json`') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>resultData });
                });
            }

            if(_endpoint === '2022/1/results.json`') {
                return new Promise<Root>((resolve) => {
                    resolve(undefined as unknown as Root);
                });
            }
    
            return new Promise<Root>((resolve) => {
                resolve({ MRData : <Mrdata>MRData });
            });
        });
    }); 

    test('Calling render with date in future should render countdown', async () => {   

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month

        const { htmlResult, date } = await getHtmlResultAndDate(card);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table> <tr> <td> <h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1></h1> </td> </tr> </table>');
        expect(date.value).toMatch('19d 16h 0m 0s');
    }),
    test('Calling render with date equal to race start should render we are racing', async () => {   

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 20, 16)); // Weird bug in jest setting this to the last of the month

        const { htmlResult, date } = await getHtmlResultAndDate(card);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table> <tr> <td> <h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1></h1> </td> </tr> </table>');
        expect(date.value).toMatch('We are racing!');
    }),
    test('Calling render with date an hour past race start render we are racing', async () => {   

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 20, 17)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));

        const { htmlResult, date } = await getHtmlResultAndDate(card);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table> <tr> <td> <h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1></h1> </td> </tr> </table>');
        expect(date.value).toMatch('We are racing!');
    }),
    test('Calling render with date an day past race start render we are racing', async () => {   

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 21)); // Weird bug in jest setting this to the last of the month

        const { htmlResult, date } = await getHtmlResultAndDate(card);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table> <tr> <td> <h2><img height="25" src="https://flagcdn.com/w40/sa.png">&nbsp;&nbsp; 2 : Saudi Arabian Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1></h1> </td> </tr> </table>');
        expect(date.value).toMatch('6d 18h 0m 0s');
    }),
    test('Calling render with date end of season', async () => {   

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month

        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table><tr><td class="text-center"><ha-icon icon="mdi:flag-checkered"></ha-icon><strong>Season is over. See you next year!</strong><ha-icon icon="mdi:flag-checkered"></ha-icon></td></tr></table><table>');
    }),
    test('Calling render with api not returning data', async () => {   

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));

        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting next race <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table>');
    }),
    test('Calling renderheader with date end of season', async () => {   

        config.show_raceinfo = true;      
        card.config = config; 

        const result = card.renderHeader(race);
        const htmlResult = await getRenderStringAsync(result);
        jest.useRealTimers();
        
        expect(htmlResult).toMatch('<table><tr><td colspan="5"><h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 22 : Season is over. See you next year!</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /></td></tr> </table>');
    }),
    test('Calling renderheader with date end of season', async () => {   

        config.show_raceinfo = undefined;  
        card.config = config;     

        const result = card.renderHeader(race);
        const htmlResult = await getRenderStringAsync(result);
        jest.useRealTimers();
        
        expect(htmlResult).toBe('');
    })
    test.each`
    show_raceinfo | expected
    ${undefined}, ${6}
    ${true}, ${12}
    ${false}, ${6}
    `('Calling getCardSize with type should return card size', ({ show_raceinfo, expected }) => { 
        config.show_raceinfo = show_raceinfo; 
        card.config = config;      

        expect(card.cardSize()).toBe(expected);
    });
});

async function getHtmlResultAndDate(card: Countdown) {
    const result = card.render();
    const promise = (result.values[0] as HTMLTemplateResult).values[0] as Promise<HTMLTemplateResult>;
    const promiseResult = await promise;

    const iterator = (promiseResult.values[3] as HTMLTemplateResult).values[0] as AsyncIterableIterator<HTMLTemplateResult>;

    const date = await iterator.next();
    
    const htmlResult = await getRenderStringAsync(promiseResult);
    return { htmlResult, date };
}
