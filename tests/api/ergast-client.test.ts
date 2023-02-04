import ErgastClient from '../../src/api/ergast-client';
import { Mrdata, Root } from '../../src/api/models';
import { MRData as scheduleData } from '../testdata/schedule.json'
import { MRData as resultData } from '../testdata/results.json'
import { MRData as driverStandingsData } from '../testdata/driverStandings.json'
import { MRData as constructorStandingsData } from '../testdata/constructorStandings.json'
import { MRData as seasonData } from '../testdata/seasons.json'
import { MRData as qualifyingData } from '../testdata/qualifying.json'
import LocalStorageMock from '../testdata/localStorageMock';
import { LocalStorageItem } from '../../src/types/formulaone-card-types';

describe('Testing ergast client file', () => {
    const client = new ErgastClient();    
    const localStorageMock = new LocalStorageMock();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    test('Passing number to GetSchedule should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>scheduleData });
        }));

        await expect(client.GetSchedule(2022)).resolves.toBe(scheduleData.RaceTable.Races);
    }),
    test('Calling GetLastResult should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>resultData });
        }));

        await expect(client.GetLastResult()).resolves.toBe(resultData.RaceTable.Races[0]);
    }),
    test('Calling GetDriverStandings should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>driverStandingsData });
        }));

        await expect(client.GetDriverStandings()).resolves.toBe(driverStandingsData.StandingsTable.StandingsLists[0].DriverStandings);
    }),
    test('Calling GetConstructorStandings should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>constructorStandingsData });
        }));

        await expect(client.GetConstructorStandings()).resolves.toBe(constructorStandingsData.StandingsTable.StandingsLists[0].ConstructorStandings);
    }),
    test('Calling GetResults should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>resultData });
        }));

        await expect(client.GetResults(2022, 2)).resolves.toBe(resultData.RaceTable);
    }),
    test('Calling GetResults api not returning data should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));

        await expect(client.GetResults(2022, 2)).resolves.toBe(undefined);
    }),
    test('Calling GetSeasons should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>seasonData });
        }));

        await expect(client.GetSeasons()).resolves.toBe(seasonData.SeasonTable.Seasons);
    }),
    test('Calling GetSeasonRaces should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>scheduleData });
        }));

        await expect(client.GetSeasonRaces(2022)).resolves.toBe(scheduleData.RaceTable.Races);
    }),
    test('Calling GetQualifyingResults should return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>qualifyingData });
        }));

        await expect(client.GetQualifyingResults(2022, 2)).resolves.toBe(qualifyingData.RaceTable);
    }),
    test('Calling GetQualifyingResults should not return correct data', async () => {           
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(client, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));

        await expect(client.GetQualifyingResults(2022, 2)).resolves.toBe(undefined);
    }),
    test('Calling GetData with data in localstorage and cacheResult true should return correct data', async () => {           
        localStorageMock.setItem('2022.json', JSON.stringify({ data: JSON.stringify({ MRData: scheduleData }), created: new Date() }));    
        
        const result = await client.GetData('2022.json', true, 24);
        expect(JSON.stringify(result)).toMatch(JSON.stringify(scheduleData));
    }),
    test('Calling GetData without data in localstorage and cacheResult true should return correct data', async () => {   
        localStorageMock.clear();        
        
        const endpoint = '2022.json';      
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        window.fetch = jest.fn().mockImplementationOnce((_input, _init): Promise<Response> => new Promise<Response>((resolve) => {            
            resolve({ json: () => scheduleData } as unknown as Response);
        }));        
        
        const result = await client.GetData(endpoint, true, 24);
        expect(JSON.stringify(result)).toMatch(JSON.stringify(scheduleData));

        const localStorageItem = <LocalStorageItem>JSON.parse(localStorageMock.getItem(endpoint));
        expect(localStorageItem.data).toMatch(JSON.stringify(scheduleData));
    })
})

