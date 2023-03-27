// Mocks
import fetchMock from "jest-fetch-mock";
import LocalStorageMock from "../testdata/localStorageMock";

// Models
import ImageClient from "../../src/api/image-client";

// Data
import * as packageJson from '../../package.json';


const localStorageMock = new LocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {    
    
    jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(jest.fn());
});

describe('Testing image client file', () => {

    const client = new ImageClient();

    test('Calling GetImage should return correct data', () => {   
        // Arrange
        fetchMock.mockResponseOnce("data:image/png;base64,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");

        // Act
        const image = client.GetImage('fakeurl');

        // Assert
        expect(JSON.stringify(image)).toMatch(JSON.stringify(`fakeurl?v=${packageJson.version}`));
    }),

    test('Calling GetImage should return correct data with localstorage', async () => {

        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify('fakeurl'));
        localStorageMock.setItem(`fakeurl?v=${packageJson.version}`, JSON.stringify({ data: 'fakedata', created: new Date() }));

        // Act
        const image = client.GetImage('fakeurl');

        // Assert
        expect(JSON.stringify(image)).toMatch(JSON.stringify('fakedata'));
    })
});