import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { createMock } from 'ts-auto-mock';
import FormulaOneCard from '../src/index';
import { FormulaOneCardConfig, FormulaOneCardType } from '../src/types/formulaone-card-types';
import { getRenderString, getRenderStringAsync, getRenderStringAsyncIndex } from './utils';
import { PropertyValues } from 'lit';
import { ConstructorStanding, DriverStanding, Mrdata, Race, Root } from '../src/api/models';
import { MRData as scheduleData } from './testdata/schedule.json'
import ErgastClient from '../src/api/ergast-client';

describe('Testing index file function setConfig', () => {
    const card = new FormulaOneCard();
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

    // test('Calling render without hass and config should return empty html', () => {   

    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('');
    // }),
    // test('Passing empty config should throw error', () => {   
    //     const config: FormulaOneCardConfig = {
    //         type: ''
    //     }

    //     expect(() => card.setConfig(config)).toThrowError('Please define FormulaOne card type (card_type).');
    // }),
    // test('Calling render with hass and config ConstructorStandings should return warning', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: FormulaOneCardType.ConstructorStandings
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('<hui-warning>TypeError: Cannot read properties of undefined (reading \'attributes\')</hui-warning>');
    // }),    
    // test('Calling render with hass and config ConstructorStandings should return expected html', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: FormulaOneCardType.ConstructorStandings
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    // }),    
    // test('Calling render with hass and config DriverStanding should return expected html', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: FormulaOneCardType.DriverStandings
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50" colspan="2">&nbsp;</th> <th>Driver</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    // }),    
    // test('Calling render with hass and config LastResult should return expected html', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: FormulaOneCardType.LastResult
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('<hui-warning>TypeError: Cannot read properties of undefined (reading \'Location\')</hui-warning>');
    // }),    
    // test('Calling render with hass and config NextRace should return expected html', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: FormulaOneCardType.NextRace
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('<hui-warning>TypeError: Cannot read properties of undefined (reading \'date\')</hui-warning>');
    // }),    
    test('Calling render with hass and config Schedule should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.Schedule
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>scheduleData });
        }));
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        
        card.setConfig(config);
        card.hass = hass;
        const result = card.render();

        const htmlResult = await getRenderStringAsyncIndex(result);

        jest.useRealTimers();

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> <tr class=""> <td class="width-50 text-center">1</td> <td>Bahrain International Circuit</td> <td>Sakhir, Bahrain</td> <td class="width-60 text-center">20-03</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">2</td> <td>Jeddah Corniche Circuit</td> <td>Jeddah, Saudi Arabia</td> <td class="width-60 text-center">27-03</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">3</td> <td>Albert Park Grand Prix Circuit</td> <td>Melbourne, Australia</td> <td class="width-60 text-center">10-04</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">4</td> <td>Autodromo Enzo e Dino Ferrari</td> <td>Imola, Italy</td> <td class="width-60 text-center">24-04</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">5</td> <td>Miami International Autodrome</td> <td>Miami, USA</td> <td class="width-60 text-center">08-05</td> <td class="width-50 text-center">21:30</td> </tr> <tr class=""> <td class="width-50 text-center">6</td> <td>Circuit de Barcelona-Catalunya</td> <td>Montmeló, Spain</td> <td class="width-60 text-center">22-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">7</td> <td>Circuit de Monaco</td> <td>Monte-Carlo, Monaco</td> <td class="width-60 text-center">29-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">8</td> <td>Baku City Circuit</td> <td>Baku, Azerbaijan</td> <td class="width-60 text-center">12-06</td> <td class="width-50 text-center">13:00</td> </tr> <tr class=""> <td class="width-50 text-center">9</td> <td>Circuit Gilles Villeneuve</td> <td>Montreal, Canada</td> <td class="width-60 text-center">19-06</td> <td class="width-50 text-center">20:00</td> </tr> <tr class=""> <td class="width-50 text-center">10</td> <td>Silverstone Circuit</td> <td>Silverstone, UK</td> <td class="width-60 text-center">03-07</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">11</td> <td>Red Bull Ring</td> <td>Spielberg, Austria</td> <td class="width-60 text-center">10-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">12</td> <td>Circuit Paul Ricard</td> <td>Le Castellet, France</td> <td class="width-60 text-center">24-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">13</td> <td>Hungaroring</td> <td>Budapest, Hungary</td> <td class="width-60 text-center">31-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">14</td> <td>Circuit de Spa-Francorchamps</td> <td>Spa, Belgium</td> <td class="width-60 text-center">28-08</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">15</td> <td>Circuit Park Zandvoort</td> <td>Zandvoort, Netherlands</td> <td class="width-60 text-center">04-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">16</td> <td>Autodromo Nazionale di Monza</td> <td>Monza, Italy</td> <td class="width-60 text-center">11-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">17</td> <td>Marina Bay Street Circuit</td> <td>Marina Bay, Singapore</td> <td class="width-60 text-center">02-10</td> <td class="width-50 text-center">14:00</td> </tr> <tr class=""> <td class="width-50 text-center">18</td> <td>Suzuka Circuit</td> <td>Suzuka, Japan</td> <td class="width-60 text-center">09-10</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">19</td> <td>Circuit of the Americas</td> <td>Austin, USA</td> <td class="width-60 text-center">23-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">20</td> <td>Autódromo Hermanos Rodríguez</td> <td>Mexico City, Mexico</td> <td class="width-60 text-center">30-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">21</td> <td>Autódromo José Carlos Pace</td> <td>São Paulo, Brazil</td> <td class="width-60 text-center">13-11</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">22</td> <td>Yas Marina Circuit</td> <td>Abu Dhabi, UAE</td> <td class="width-60 text-center">20-11</td> <td class="width-50 text-center">14:00</td> </tr> </tbody> </table> </ha-card>');
    })//,
    // test('Calling render with hass and config Schedule without title should return expected html', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         card_type: FormulaOneCardType.Schedule
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     const result = card.render();
    //     const htmlResult = getRenderString(result);

    //     expect(htmlResult).toMatch('<ha-card elevation="2"> <table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> </tbody> </table> </ha-card>');
    // }),
    // test('Calling shouldUpdate with config should return true', () => {   

    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: FormulaOneCardType.Schedule
    //     }
    //     const props : PropertyValues = new Map([['config', config]]);        

    //     const result = card['shouldUpdate'](props);

    //     expect(result).toBeTruthy();
    // }),
    // test.each`
    // type | expected
    // ${FormulaOneCardType.ConstructorStandings}, ${11}
    // ${FormulaOneCardType.DriverStandings}, ${12}
    // ${FormulaOneCardType.LastResult}, ${11}
    // ${FormulaOneCardType.NextRace}, ${8}
    // ${FormulaOneCardType.Schedule}, ${12}
    // `('Calling getCardSize with type should return card size', ({ type, expected }) => {  
        
    //     const config: FormulaOneCardConfig = {
    //         type: '',
    //         title: 'Test',
    //         card_type: type.toString()
    //     }

    //     card.setConfig(config);
    //     card.hass = hass;
    //     card.render();
    //     expect(card.getCardSize()).toBe(expected);
    // })
})

