import { getRefreshTime } from '../../src/utils';
import { MRData as scheduleData } from '../testdata/schedule.json'
import LocalStorageMock from '../testdata/localStorageMock';

describe('Testing util file function getRefreshTime', () => {
    
    const localStorageMock = new LocalStorageMock();

    beforeAll(() => {       
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month

        const now = new Date();
        const currentYear = now.getFullYear();
        localStorageMock.setItem(`${currentYear}.json`, JSON.stringify({ data: JSON.stringify({ MRData: scheduleData }), created: new Date() }));       

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    });

    afterAll(() => {
        jest.useRealTimers();
    })

    test('Calling getRefreshTime without data in localstorage should return 24', () => {   

        const result = getRefreshTime("");
        expect(result).toBe(24);
    }),
    test('Calling getRefreshTime with data in localstorage should return 24', () => {   

        localStorageMock.setItem('', JSON.stringify({ data: [], created: new Date(2022, 3, 1)}))

        const result = getRefreshTime("");
        expect(result).toBe(24);
    }),
    test('Calling getRefreshTime with data in localstorage should return 1', () => {   

        localStorageMock.setItem('', JSON.stringify({ data: [], created: new Date(2022, 2, 20, 10)}))

        const result = getRefreshTime("");
        expect(result).toBe(1);
    })
})

