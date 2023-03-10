// Mocks
import { createMock } from "ts-auto-mock";
import fetchMock from "jest-fetch-mock";
import LocalStorageMock from '../testdata/localStorageMock';

// Models
import Countdown from "../../src/cards/countdown";
import { CountdownType, FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { getRenderStringAsync } from "../utils";
import { Mrdata, Race } from "../../src/api/f1-models";
import { HTMLTemplateResult } from "lit";
import { HomeAssistant, NumberFormat, TimeFormat } from "custom-card-helpers";
import FormulaOneCard from "../../src";
import * as customCardHelper from "custom-card-helpers";
import RestCountryClient from "../../src/api/restcountry-client";
import { Country } from "../../src/types/rest-country-types";

// Importing test data
import * as countries from '../testdata/countries.json'
import { MRData as scheduleData } from '../testdata/schedule.json'

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

    const localStorageMock = new LocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    beforeEach(() => {
        localStorageMock.clear();     
        fetchMock.resetMocks();
        jest.useFakeTimers();
    });

    beforeAll(() => {
        jest.spyOn(RestCountryClient.prototype, 'GetCountriesFromLocalStorage').mockImplementation(() => {
            return countries as Country[];
        });
    }); 

    afterEach (() => {        
        jest.useRealTimers();  
    });

    test('Calling render with date in future should render countdown', async () => {   
        // Arrange
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const { htmlResult, date } = await getHtmlResultAndDate(card);
        
        // Assert
        expect(htmlResult).toMatch('<table @action=_handleAction .actionHandler= class=""> <tr> <td> <h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1 class=""></h1> </td> </tr> </table>');
        expect(date.value).toMatch('19d 16h 0m 0s');
    }),
    test('Calling render with date equal to race start should render we are racing', async () => {   
        // Arrange
        jest.setSystemTime(new Date(2022, 2, 20, 16)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const { htmlResult, date } = await getHtmlResultAndDate(card);

        // Assert      
        expect(htmlResult).toMatch('<table @action=_handleAction .actionHandler= class=""> <tr> <td> <h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1 class=""></h1> </td> </tr> </table>');
        expect(date.value).toMatch('We are racing!');
    }),
    test('Calling render with date an hour past race start render we are racing', async () => {   
        // Arrange
        jest.setSystemTime(new Date(2022, 2, 20, 17)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const { htmlResult, date } = await getHtmlResultAndDate(card);
        
        // Assert
        expect(htmlResult).toMatch('<table @action=_handleAction .actionHandler= class=""> <tr> <td> <h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1 class=""></h1> </td> </tr> </table>');
        expect(date.value).toMatch('We are racing!');
    }),
    test('Calling render with date an day past race start render countdown till next race', async () => {   
        // Arrange
        jest.setSystemTime(new Date(2022, 2, 21)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const { htmlResult, date } = await getHtmlResultAndDate(card);
        
        // Assert
        expect(htmlResult).toMatch('<table @action=_handleAction .actionHandler= class=""> <tr> <td> <h2 class=""><img height="25" src="https://flagcdn.com/w320/sa.png">&nbsp;&nbsp; 2 : Saudi Arabian Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1 class=""></h1> </td> </tr> </table>');
        expect(date.value).toMatch('6d 18h 0m 0s');
    }),
    test('Calling render with date end of season', async () => {   
        // Arrange
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);        
        expect(htmlResult).toMatch('<table><tr><td class="text-center"><ha-icon icon="mdi:flag-checkered"></ha-icon><strong>Season is over. See you next year!</strong><ha-icon icon="mdi:flag-checkered"></ha-icon></td></tr></table><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table>');
    }),
    test('Calling render with api not returning data', async () => {   
        // Arrange
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce('{}', { status: 500 });

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);        
        expect(htmlResult).toMatch('<table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting next race <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table>');
    }),
    test('Calling renderheader with date end of season and show_raceinfo = true', async () => {   
        // Arrange
        config.show_raceinfo = true;   
        card.config = config; 

        // Act
        const result = card.renderHeader(race, new Date(2022, 11, 30));

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table><tr><td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 22 : Season is over. See you next year!</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /></td></tr> </table>');
    }),
    test('Calling renderheader with date end of season and show_raceinfo undefined', async () => {   
        // Arrange
        config.show_raceinfo = undefined;  
        card.config = config;     

        // Act
        const result = card.renderHeader(race, new Date(2022, 11, 30));

        // Assert
        const htmlResult = await getRenderStringAsync(result);        
        expect(htmlResult).toBe('');
    }),
    test.each`
    show_raceinfo | expected
    ${undefined}, ${6}
    ${true}, ${12}
    ${false}, ${6}
    `('Calling getCardSize with type should return card size', ({ show_raceinfo, expected }) => { 
        config.show_raceinfo = show_raceinfo; 
        card.config = config;      

        expect(card.cardSize()).toBe(expected);
    }),
    test('Calling render with actions', async () => {   
        // Arrange
        const spy = jest.spyOn(customCardHelper, 'handleAction');

        card.config.f1_font = true;
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

        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const { htmlResult, date, handleAction } = await getHtmlResultAndDate(card);
        
        // Assert
        expect(htmlResult).toMatch('<table @action=_handleAction .actionHandler= class="clickable"> <tr> <td> <h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp;&nbsp; 1 : Bahrain Grand Prix</h2> </td> </tr> <tr> <td class="text-center"> <h1 class="formulaone-font"></h1> </td> </tr> </table>');
        expect(date.value).toMatch('19d 16h 0m 0s');
        
        // eslint-disable-next-line @typescript-eslint/ban-types
        handleAction({ detail: { action: 'tap' } });
        handleAction({ detail: { action: 'double_tap' } });
        handleAction({ detail: { action: 'hold' } });
        
        expect(customCardHelper.handleAction).toBeCalledTimes(3);

        spy.mockClear();
    }),    
    test.each`
    countdown_type | current_date | expected
    ${CountdownType.Practice1}, ${new Date(2022, 3, 19)}, ${new Date("2022-04-22T11:30:00.000Z")}
    ${CountdownType.Practice2}, ${new Date(2022, 3, 19)}, ${new Date("2022-04-23T10:30:00.000Z")}
    ${CountdownType.Practice3}, ${new Date(2022, 2, 1)}, ${new Date("2022-03-19T12:00:00.000Z")}
    ${CountdownType.Qualifying}, ${new Date(2022, 3, 19)}, ${new Date("2022-04-22T15:00:00.000Z")}    
    ${CountdownType.Race}, ${new Date(2022, 3, 19)}, ${new Date("2022-04-24T13:00:00.000Z")}  
    ${CountdownType.Sprint}, ${new Date(2022, 3, 19)}, ${new Date("2022-04-23T14:30:00.000Z")}
    `(`Calling render with countdown_type $countdown_type`, async ({ countdown_type, current_date, expected }) => {
        // Arrange
        config.countdown_type = countdown_type; 
        card.config = config;             
        jest.setSystemTime(current_date); // Weird bug in jest setting this to the last of the month

        // Act
        const result = card.getNextEvent(scheduleData.RaceTable.Races);
        
        // Assert       
        expect(result.raceDateTime).toMatchObject(expected);
    });
});

async function getHtmlResultAndDate(card: Countdown) {
    const result = card.render();

    const promise = (result.values[0] as HTMLTemplateResult).values[0] as Promise<HTMLTemplateResult>;
    const promiseResult = await promise;

    const iterator = (promiseResult.values[8] as HTMLTemplateResult).values[0] as AsyncIterableIterator<HTMLTemplateResult>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleAction = promiseResult.values[0] as Function;

    const date = await iterator.next();
    
    const htmlResult = await getRenderStringAsync(promiseResult);
    return { htmlResult, date, handleAction };
}
