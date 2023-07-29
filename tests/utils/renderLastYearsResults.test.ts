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
    };

    test('Given config with hide_raceinfo = false when raceinfo is rendered then raceinfo is rendered', async () => {
        card.config.f1_font = false;
        const result = renderLastYearsResults(card.config, resultData.RaceTable.Races[0] as Race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class=""></h1> <h2 class=""> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> Sergio Pérez (Red Bull) </h2> <h3 class=""> <ha-icon slot="icon" icon="mdi:timer-outline"></ha-icon> George Russell (1:46.458) </h3> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr>');
    }),
    test('Given config with hide_raceinfo = false when raceinfo is rendered then raceinfo is rendered', async () => {
        card.config.f1_font = true;

        const result = renderLastYearsResults(card.config, resultData.RaceTable.Races[0] as Race);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class="formulaone-font"></h1> <h2 class="formulaone-font"> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> Sergio Pérez (Red Bull) </h2> <h3 class="formulaone-font"> <ha-icon slot="icon" icon="mdi:timer-outline"></ha-icon> George Russell (1:46.458) </h3> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr>');
    })
    ,
    test('Given config and data without fastest lap with hide_raceinfo = false when raceinfo is rendered then raceinfo is rendered', async () => {
        card.config.f1_font = true;

        const raceData = resultData.RaceTable.Races[0] as Race;
        raceData.Results?.forEach(element => {
            element.FastestLap = undefined;
        });

        const result = renderLastYearsResults(card.config, raceData);
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td class="text-center"> <h1 class="formulaone-font"></h1> <h2 class="formulaone-font"> <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> Sergio Pérez (Red Bull) </h2> <h3 class="formulaone-font"> <ha-icon slot="icon" icon="mdi:timer-outline"></ha-icon> () </h3> </td> </tr> </table> </td> <tr><td colspan="5">&nbsp;</td></tr>');
    })
});