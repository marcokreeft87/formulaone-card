import { HomeAssistant, NumberFormat, TimeFormat } from "custom-card-helpers";
import { createMock } from "ts-auto-mock";
import { BaseCard } from "../../src/cards/base-card";
import { renderLastYearsResults } from "../../src/utils";
import { getRenderStringAsyncIndex } from "../utils";
import { Race } from "../../src/api/f1-models";
import { MRData as resultData } from '../testdata/results.json'

describe('Testing util file function renderLastYearsResults', () => {

    const card = createMock<BaseCard>();
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

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
        card.config.f1_font = false;
        const result = renderLastYearsResults(card.config, resultData.RaceTable.Races[0] as Race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class="">Sergio Pérez (Red Bull)</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr>');
    }),
    test('Given config with hide_raceinfo = false when raceinfo is rendered then raceinfo is rendered', async () => {
        card.config.f1_font = true;

        const result = renderLastYearsResults(card.config, resultData.RaceTable.Races[0] as Race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class="formulaone-font"> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> </h1> <h2 class="formulaone-font">Sergio Pérez (Red Bull)</h2> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr>');
    })
});