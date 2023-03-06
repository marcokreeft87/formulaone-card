import { createMock } from "ts-auto-mock";
import { Day, Hour } from "../../src/api/weather-models";
import { FormulaOneCardConfig, WeatherUnit } from "../../src/types/formulaone-card-types";
import { renderWeatherInfo } from "../../src/utils";
import { getRenderString } from '../utils';

describe('Testing util file function renderWeatherInfo ', () => {
    
    const config = createMock<FormulaOneCardConfig>();
    const weather = createMock<Day>();
    weather.hours = [];
    const hour = createMock<Hour>();
    hour.winddir = 270;
    hour.windspeed = 10;
    hour.temp = 20;
    hour.precip = 2;
    hour.precipprob = 10;

    weather.hours.push(hour);

    test('Given config with hide_weatherinfo = false when weatherinfo is rendered then weatherinfo is rendered', () => {
        config.hide_weatherinfo = false;    

        const result = renderWeatherInfo(weather, config, new Date(2021, 1, 1, 0, 0, 0));
        const htmlResult = getRenderString(result);
    
        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> W mph</td> <td><ha-icon slot="icon" icon="mdi:weather-pouring"></ha-icon> mm</td> <td><ha-icon slot="icon" icon="mdi:cloud-percent-outline"></ha-icon> %</td> </tr> <tr> <td><ha-icon slot="icon" icon="mdi:clouds"></ha-icon> %</td> <td><ha-icon slot="icon" icon="mdi:thermometer-lines"></ha-icon> °C</td> <td><ha-icon slot="icon" icon="mdi:sun-thermometer"></ha-icon> °C</td> </tr> </table> </td> </tr> <tr><td colspan="5">&nbsp;</td></tr>');
    }),
    test('Given weatherData, config and raceDate when weatherinfo is rendered then weatherinfo is rendered', () => {
        config.hide_weatherinfo = false;    

        const result = renderWeatherInfo(weather, config, new Date(2021, 1, 1, 0, 0, 0));
        const htmlResult = getRenderString(result);
    
        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> W mph</td> <td><ha-icon slot="icon" icon="mdi:weather-pouring"></ha-icon> mm</td> <td><ha-icon slot="icon" icon="mdi:cloud-percent-outline"></ha-icon> %</td> </tr> <tr> <td><ha-icon slot="icon" icon="mdi:clouds"></ha-icon> %</td> <td><ha-icon slot="icon" icon="mdi:thermometer-lines"></ha-icon> °C</td> <td><ha-icon slot="icon" icon="mdi:sun-thermometer"></ha-icon> °C</td> </tr> </table> </td> </tr> <tr><td colspan="5">&nbsp;</td></tr>');
    }),
    test('Given weatherData, config with unit metric unit and raceDate when weatherinfo is rendered then weatherinfo is rendered', () => {
        config.hide_weatherinfo = false; 
        config.weather_options = { 
            unit: WeatherUnit.Metric
        }

        const result = renderWeatherInfo(weather, config, new Date(2021, 1, 1, 0, 0, 0));
        const htmlResult = getRenderString(result);
    
        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> W km/h</td> <td><ha-icon slot="icon" icon="mdi:weather-pouring"></ha-icon> mm</td> <td><ha-icon slot="icon" icon="mdi:cloud-percent-outline"></ha-icon> %</td> </tr> <tr> <td><ha-icon slot="icon" icon="mdi:clouds"></ha-icon> %</td> <td><ha-icon slot="icon" icon="mdi:thermometer-lines"></ha-icon> °C</td> <td><ha-icon slot="icon" icon="mdi:sun-thermometer"></ha-icon> °C</td> </tr> </table> </td> </tr> <tr><td colspan="5">&nbsp;</td></tr>');
    }),
    test('Given weatherData, config with unit metric unit and raceDate when weatherinfo is rendered then weatherinfo is rendered', () => {
        config.hide_weatherinfo = false; 
        config.weather_options = { 
            unit: WeatherUnit.MilesFahrenheit
        }

        const result = renderWeatherInfo(weather, config, new Date(2021, 1, 1, 0, 0, 0));
        const htmlResult = getRenderString(result);
    
        expect(htmlResult).toBe('<tr> <td colspan="5"> <table class="weather-info"> <tr> <td><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> W mph</td> <td><ha-icon slot="icon" icon="mdi:weather-pouring"></ha-icon> mm</td> <td><ha-icon slot="icon" icon="mdi:cloud-percent-outline"></ha-icon> %</td> </tr> <tr> <td><ha-icon slot="icon" icon="mdi:clouds"></ha-icon> %</td> <td><ha-icon slot="icon" icon="mdi:thermometer-lines"></ha-icon> °F</td> <td><ha-icon slot="icon" icon="mdi:sun-thermometer"></ha-icon> °F</td> </tr> </table> </td> </tr> <tr><td colspan="5">&nbsp;</td></tr>');
    })
});