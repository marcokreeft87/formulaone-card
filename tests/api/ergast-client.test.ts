import ErgastClient from "../../src/api/ergast-client";
import LocalStorageMock from "../testdata/localStorageMock";
import fetchMock from "jest-fetch-mock";

// Models
import { Mrdata } from "../../src/api/f1-models";
import { LocalStorageItem } from '../../src/types/formulaone-card-types';

// Importing test data
import { MRData as scheduleData } from '../testdata/schedule.json'
import { MRData as resultData } from '../testdata/results.json'
import { MRData as driverStandingsData } from '../testdata/driverStandings.json'
import { MRData as constructorStandingsData } from '../testdata/constructorStandings.json'
import { MRData as seasonData } from '../testdata/seasons.json'
import { MRData as qualifyingData } from '../testdata/qualifying.json'

describe('Testing ergast client file', () => {
    const client = new ErgastClient();    
    const localStorageMock = new LocalStorageMock();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    beforeEach(() => {        
        localStorageMock.clear();     
    });

    test('Passing number to GetSchedule should return correct data', async () => { 
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = await client.GetSchedule(2022);

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(scheduleData.RaceTable.Races));
    }),
    test('Calling GetLastResult should return correct data', async () => {       
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));

        // Act
        const result = await client.GetLastResult();

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(resultData.RaceTable.Races[0]));
    }),
    test('Calling GetDriverStandings should return correct data', async () => {       
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>driverStandingsData }));

        // Act
        const result = await client.GetDriverStandings();

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(driverStandingsData.StandingsTable.StandingsLists[0].DriverStandings));
    }),
    test('Calling GetConstructorStandings should return correct data', async () => {           
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>constructorStandingsData }));

        // Act
        const result = await client.GetConstructorStandings();

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(constructorStandingsData.StandingsTable.StandingsLists[0].ConstructorStandings));
    }),
    test('Calling GetResults should return correct data', async () => {  
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));

        // Act
        const result = await client.GetResults(2022, 2);

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(resultData.RaceTable));
    }),
    test('Calling GetSeasons should return correct data', async () => {           
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));

        // Act
        const result = await client.GetSeasons();

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(seasonData.SeasonTable.Seasons));
    }),
    test('Calling GetSeasonRaces should return correct data', async () => {     
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = await client.GetSeasonRaces(2022);

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(scheduleData.RaceTable.Races));
    }),
    test('Calling GetQualifyingResults should return correct data', async () => {    
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>qualifyingData }));

        // Act
        const result = await client.GetQualifyingResults(2022, 2);

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(qualifyingData.RaceTable));
    }),
    test('Calling GetData with data in localstorage and cacheResult true should return correct data', async () => {      
        // Arrange
        localStorageMock.setItem('2022.json', JSON.stringify({ data: JSON.stringify({ MRData: scheduleData }), created: new Date() }));    

        // Act
        const result = await client.GetData('2022.json', true, 24);

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(scheduleData));
    }),
    test('Calling GetData without data in localstorage and cacheResult true should return correct data', async () => {  
        // Arrange 
        const endpoint = '2022.json';      
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));  
        
        // Act
        const result = await client.GetData(endpoint, true, 24);
        const localStorageItem = <LocalStorageItem>JSON.parse(localStorageMock.getItem(endpoint));

        // Assert
        expect(JSON.stringify(result)).toMatch(JSON.stringify(scheduleData));
        expect(localStorageItem.data).toMatch(JSON.stringify(scheduleData));
    })
});