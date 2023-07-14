import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { createMock } from 'ts-auto-mock';
import fetchMock from "jest-fetch-mock";
import FormulaOneCard from '../../src';
import { Mrdata, Race } from '../../src/api/f1-models';
import { BaseCard } from '../../src/cards/base-card';
import { WeatherUnit } from '../../src/types/formulaone-card-types';
import { renderRaceInfo } from '../../src/utils';
import { getRenderString, getRenderStringAsyncIndex } from '../utils';
import { MRData as scheduleData } from '../testdata/schedule.json'
import { MRData as resultData } from '../testdata/results.json'

describe('Testing util file function renderRaceInfo', () => {

    const card = createMock<BaseCard>();
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }
    card.hass = hass;
    card.parent = createMock<FormulaOneCard>();
    const race : Race = {
        season: '2021',
        round: '1',
        url: 'https://en.wikipedia.org/wiki/2021_Abu_Dhabi_Grand_Prix',
        Sprint: {
            date: '2021-12-11',
            time: '15:00:00Z',
        },
        Qualifying: {
            date: '2021-12-11',
            time: '18:00:00Z',
        },
        FirstPractice: {
            date: '2021-12-09',
            time: '11:00:00Z',
        },
        SecondPractice: {
            date: '2021-12-10',
            time: '12:00:00Z',
        },
        time: '18:00:00Z',
        date: '2021-12-12',
        raceName: 'Abu Dhabi Grand Prix',
        Circuit: {
            circuitId: 'yas_marina',
            url: 'http://en.wikipedia.org/wiki/Yas_Marina_Circuit',
            circuitName: 'Yas Marina Circuit',
            Location: {
                lat: '24.4672',
                long: '54.6031',
                locality: 'Abu Dhabi',
                country: 'United Arab Emirates',
            }
        },
    };

    test('Given config with hide_raceinfo = false when raceinfo is rendered then raceinfo is rendered', async () => {
        card.config.hide_racedatetimes = false;

        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    }),
    test('Given config with hide_raceinfo = true when raceinfo is rendered then raceinfo is not rendered', () => {
        card.config.hide_racedatetimes = true;
        const result = renderRaceInfo(card, race);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toBe('');
    }),
    test('Given config with hide_raceinfo = undefined when raceinfo is rendered then raceinfo is rendered', async () => {
        card.config.hide_racedatetimes = undefined;
        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    }),
    test('Given config with show_weather = true and no weather options when raceinfo is rendered then weather is rendered', async () => {
        card.config.hide_racedatetimes = false;
        card.config.show_weather = true;

        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    }),
    test('Given config with show_weather = true and weather options without api key when raceinfo is rendered then weather is rendered', async () => {
        card.config.hide_racedatetimes = false;
        card.config.show_weather = true;
        card.config.weather_options = {
            api_key: undefined,
        };

        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    }),
    test('Given config with show_weather = true and weather options unit metric when raceinfo is rendered then weather is rendered', async () => {
        card.config.hide_racedatetimes = false;
        card.config.show_weather = true;
        card.config.weather_options = {
            api_key: 'fakekey',
            unit: WeatherUnit.Metric,
        };

        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    }),
    test('Given config with show_weather = true and weather options unit MilesFahrenheit when raceinfo is rendered then weather is rendered', async () => {
        card.config.hide_racedatetimes = false;
        card.config.show_weather = true;
        card.config.weather_options = {
            api_key: 'fakekey',
            unit: WeatherUnit.MilesFahrenheit,
        };

        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    }),
    test('Given config with show_lastyears_result = true when raceinfo is rendered then last years result is rendered', async () => {
        card.config.hide_racedatetimes = false;
        card.config.show_lastyears_result = true;
        jest.useFakeTimers();
        
        jest.setSystemTime(new Date(2022, 3, 20)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));

        const result = renderRaceInfo(card, race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class=""> ()</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr><tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class=""> ()</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr><tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class=""> ()</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr><tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class=""> ()</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr><tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class=""> ()</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr><tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class=""> ()</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr><tr><td></td><td>12-12-21</td><td>&nbsp;</td><td></td><td align="right">do 12:00</td></tr> <tr><td></td><td>1</td><td>&nbsp;</td><td></td><td align="right">vr 13:00</td></tr> <tr><td></td><td>Abu Dhabi Grand Prix</td><td>&nbsp;</td><td></td><td align="right">-</td></tr> <tr><td></td><td>Yas Marina Circuit</td><td>&nbsp;</td><td></td><td align="right">za 19:00</td></tr> <tr><td></td><td>United Arab Emirates</td><td>&nbsp;</td><td></td><td align="right">za 16:00</td></tr> <tr><td></td><td>Abu Dhabi</td><td>&nbsp;</td><td></td><td align="right">zo 19:00</td></tr>');
    })
})