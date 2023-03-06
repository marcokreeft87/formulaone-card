import { createMock } from "ts-auto-mock";
import WeatherClient from "../../src/api/weather-client";
import { WeatherResponse } from "../../src/api/weather-models";
import fetchMock from "jest-fetch-mock";

describe('Testing weather client file', () => {

    const client = new WeatherClient('fakekey', 'metric');    
    const weatherData = createMock<WeatherResponse>();

    test('Calling GetWeatherFromLocalStorage should return correct data without localstorage', async () => {   
        fetchMock.mockResponseOnce(JSON.stringify(weatherData));
        
        const weather = await client.getWeatherData("1", "2", "2023-01-01");
        expect(JSON.stringify(weather)).toMatch(JSON.stringify(weatherData));
    })
});