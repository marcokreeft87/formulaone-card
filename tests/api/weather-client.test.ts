// Mocks
import { createMock } from "ts-auto-mock";
import fetchMock from "jest-fetch-mock";

// Models
import WeatherClient from "../../src/api/weather-client";
import { WeatherResponse } from "../../src/api/weather-models";

describe('Testing weather client file', () => {

    const client = new WeatherClient('fakekey', 'metric');    
    const weatherData = createMock<WeatherResponse>();

    test('Calling GetWeatherFromLocalStorage should return correct data without localstorage', async () => {   
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify(weatherData));
        
        // Act
        const weather = await client.getWeatherData("1", "2", "2023-01-01");

        // Assert
        expect(JSON.stringify(weather)).toMatch(JSON.stringify(weatherData));
    })
});