import ErgastClient from '../../src/api/ergast-client';
import { Mrdata, Root } from '../../src/api/models';
import { MRData as scheduleData } from '../testdata/schedule.json'
import { MRData as resultData } from '../testdata/results.json'
import { MRData as driverStandingsData } from '../testdata/driverStandings.json'
import { MRData as constructorStandingsData } from '../testdata/constructorStandings.json'
import { MRData as seasonData } from '../testdata/seasons.json'

describe('Testing ergast client file', () => {
    const client = new ErgastClient();

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
    })
})

