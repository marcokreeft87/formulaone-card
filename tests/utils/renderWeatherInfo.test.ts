import { createMock } from "ts-auto-mock";
import { Day } from "../../src/api/weather-models";
import { FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { renderWeatherInfo } from "../../src/utils";
import { getRenderString } from '../utils';

describe('Testing util file function renderWeatherInfo ', () => {
    
    const config = createMock<FormulaOneCardConfig>();
    const weather = createMock<Day>();
    weather.winddir = 270;
    weather.windspeed = 10;
    weather.temp = 20;
    weather.precip = 2;
    weather.precipprob = 10;

    test('Given config with hide_weatherinfo = false when weatherinfo is rendered then weatherinfo is rendered', () => {
        config.hide_weatherinfo = false;    

        const result = renderWeatherInfo(weather, config);
        const htmlResult = getRenderString(result);
    
        console.log(htmlResult);
        expect(htmlResult).toBe('<tr><td colspan="2"><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> W mph</td><td>&nbsp;</td><td colspan="2"><ha-icon slot="icon" icon="mdi:thermometer-lines"></ha-icon> °C</td></tr> <tr><td colspan="2"><ha-icon slot="icon" icon="mdi:weather-pouring"></ha-icon> mm</td><td>&nbsp;</td><td colspan="2"><ha-icon slot="icon" icon="mdi:cloud-percent-outline"></ha-icon> %</td></tr>');
    });
});