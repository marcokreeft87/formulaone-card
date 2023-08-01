// Mocks
import { createMock } from "ts-auto-mock";
import fetchMock from "jest-fetch-mock";
import LocalStorageMock from '../testdata/localStorageMock';

// Models
import NextRace from '../../src/cards/next-race';
import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { getRenderString, getRenderStringAsync, getRenderStringAsyncIndex } from '../utils';
import { FormulaOneCardConfig } from '../../src/types/formulaone-card-types';
import { Mrdata } from '../../src/api/f1-models';
import { getApiErrorMessage, getEndOfSeasonMessage } from '../../src/utils';
import FormulaOneCard from '../../src';
import RestCountryClient from '../../src/api/restcountry-client';
import { Country } from '../../src/types/rest-country-types';
import ImageClient from "../../src/api/image-client";

// Importing test data
import * as countries from '../testdata/countries.json'
import { MRData } from '../testdata/schedule.json'

describe('Testing next-race file', () => {
    const parent = createMock<FormulaOneCard>({ 
        config: createMock<FormulaOneCardConfig>(),
    });

    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

    parent._hass = hass;    
    
    const localStorageMock = new LocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    beforeEach(() => {
        localStorageMock.clear();     
        fetchMock.resetMocks();
        jest.useFakeTimers();
        
        jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(() => null);
        jest.spyOn(ImageClient.prototype, 'GetImage').mockImplementation((url: string) => { return url; });  
    });

    beforeAll(() => {
        jest.spyOn(RestCountryClient.prototype, 'GetCountriesFromLocalStorage').mockImplementation(() => {
            return countries as Country[];
        });
    }); 

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Calling render with api returning data', async () => {  
        // Arrange 
        const card = new NextRace(parent);
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>MRData }));
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsyncIndex(result);
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br></td> </tr> </tbody> </table>');
    }),
    test('Calling render with api not returning data', async () => {   
        // Arrange
        const card = new NextRace(parent);
        fetchMock.mockResponseOnce('{}', { status: 500 });
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getApiErrorMessage('next race'));
        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling render with api returning data', async () => {   
        // Arrange
        const card = new NextRace(parent);
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>MRData }));
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getEndOfSeasonMessage('Season is over. See you next year!'));
        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling render with api returning data sprint race', async () => {  
        // Arrange 
        const card = new NextRace(parent);
        jest.setSystemTime(new Date(2022, 3, 20)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>MRData }));
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsyncIndex(result);
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br></td> </tr> </tbody> </table>');
    }),
    test('Calling render with only_show_date true and api returning data sprint race', async () => {  
        // Arrange 
        const card = new NextRace(parent);
        card.config.only_show_date = true;
        jest.setSystemTime(new Date(2022, 3, 20)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>MRData }));
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsyncIndex(result);
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br></td> </tr> <tr> <td class="text-center"> <h1 class="">24-04-22</h1> </td> </tr><tr> <td class="text-center"> <h1 class="">24-04-22</h1> </td> </tr> </tbody> </table>');
    }),
    test('Calling render with only_show_date true and f1 font and api returning data sprint race', async () => {  
        // Arrange 
        const card = new NextRace(parent);
        card.config.only_show_date = true;
        card.config.f1_font = true;
        jest.setSystemTime(new Date(2022, 3, 20)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>MRData }));
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsyncIndex(result);
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br></td> </tr> <tr> <td class="text-center"> <h1 class="formulaone-font">24-04-22</h1> </td> </tr><tr> <td class="text-center"> <h1 class="formulaone-font">24-04-22</h1> </td> </tr> </tbody> </table>');
    }),
    test('Calling render with show_raceinfo true and f1 font and api returning data sprint race', async () => {  
        // Arrange 
        const card = new NextRace(parent);
        card.config.show_raceinfo = true;
        card.config.f1_font = true;
        jest.setSystemTime(new Date(2022, 3, 20)); // Weird bug in jest setting this to the last of the month
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>MRData }));
        
        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsyncIndex(result);
        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2><h2 class="formulaone-font"><img height="25" src="https://flagcdn.com/w320/it.png">&nbsp; 4 : Emilia Romagna Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br></td> </tr> <tr><td>Date</td><td>24-04-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:30</td></tr> <tr><td>Race</td><td>4</td><td>&nbsp;</td><td>Practice 2</td><td align="right">za 12:30</td></tr> <tr><td>Race name</td><td>Emilia Romagna Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">-</td></tr> <tr><td>Circuit name</td><td>Autodromo Enzo e Dino Ferrari</td><td>&nbsp;</td><td>Qualifying</td><td align="right">vr 17:00</td></tr> <tr><td>Location</td><td>Italy</td><td>&nbsp;</td><td>Sprint</td><td align="right">za 16:30</td></tr> <tr><td>City</td><td>Imola</td><td>&nbsp;</td><td>Race</td><td align="right">zo 15:00</td></tr> </tbody> </table>');
    }),
    test('Calling cardSize with hass and sensor without data', () => { 
        const card = new NextRace(parent);
        expect(card.cardSize()).toBe(8);
    });
});