import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { createMock } from 'ts-auto-mock';
import FormulaOneCard from '../src/index';
import { FormulaOneCardConfig, FormulaOneCardType } from '../src/types/formulaone-card-types';
import { getRenderString, getRenderStringAsyncIndex } from './utils';
import { PropertyValues } from 'lit';
import { Mrdata, Root } from '../src/api/models';
import { MRData as scheduleData } from './testdata/schedule.json'
import { MRData as constructorStandingsData } from './testdata/constructorStandings.json'
import { MRData as driverStandingsData } from './testdata/driverStandings.json'
import { MRData as resultData } from './testdata/results.json'
import ErgastClient from '../src/api/ergast-client';

describe('Testing index file function setConfig', () => {
    const card = new FormulaOneCard();
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

    test('Calling render without hass and config should return empty html', () => {   

        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('');
    }),
    test('Passing empty config should throw error', async () => {   
        const config: FormulaOneCardConfig = {
            type: '',            
            card_type: FormulaOneCardType.ConstructorStandings
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));

        card.setConfig(config);
        card.hass = hass;
        card.render();
        
        const result = card.render();
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Red Bull</td> <td class="width-60 text-center">759</td> <td class="text-center">17</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Ferrari</td> <td class="width-60 text-center">554</td> <td class="text-center">4</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Mercedes</td> <td class="width-60 text-center">515</td> <td class="text-center">1</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">173</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>McLaren</td> <td class="width-60 text-center">159</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Alfa Romeo</td> <td class="width-60 text-center">55</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Aston Martin</td> <td class="width-60 text-center">55</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Haas F1 Team</td> <td class="width-60 text-center">37</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>AlphaTauri</td> <td class="width-60 text-center">35</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Williams</td> <td class="width-60 text-center">8</td> <td class="text-center">0</td> </tr> </tbody> </table> </ha-card>');
    }),
    test('Passing empty config should throw error', () => {   
        const config: FormulaOneCardConfig = {
            type: ''
        }

        expect(() => card.setConfig(config)).toThrowError('Please define FormulaOne card type (card_type).');
    }),
    test('Calling render ConstructorStandings should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.ConstructorStandings
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>constructorStandingsData });
        }));

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Red Bull</td> <td class="width-60 text-center">576</td> <td class="text-center">13</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Ferrari</td> <td class="width-60 text-center">439</td> <td class="text-center">4</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Mercedes</td> <td class="width-60 text-center">373</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>McLaren</td> <td class="width-60 text-center">129</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">125</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Alfa Romeo</td> <td class="width-60 text-center">52</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Aston Martin</td> <td class="width-60 text-center">37</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Haas F1 Team</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>AlphaTauri</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Williams</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> </tbody> </table> </ha-card>');
    }),    
    test('Calling render with hass and config DriverStanding should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.DriverStandings
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>driverStandingsData });
        }));

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50" colspan="2">&nbsp;</th> <th>Driver</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-40 text-center">1</td> <td>VER</td> <td>Max Verstappen</td> <td class="width-60 text-center">341</td> <td class="text-center">11</td> </tr> <tr> <td class="width-40 text-center">2</td> <td>LEC</td> <td>Charles Leclerc</td> <td class="width-60 text-center">237</td> <td class="text-center">3</td> </tr> <tr> <td class="width-40 text-center">3</td> <td>PER</td> <td>Sergio Pérez</td> <td class="width-60 text-center">235</td> <td class="text-center">2</td> </tr> <tr> <td class="width-40 text-center">4</td> <td>RUS</td> <td>George Russell</td> <td class="width-60 text-center">203</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">5</td> <td>SAI</td> <td>Carlos Sainz</td> <td class="width-60 text-center">202</td> <td class="text-center">1</td> </tr> <tr> <td class="width-40 text-center">6</td> <td>HAM</td> <td>Lewis Hamilton</td> <td class="width-60 text-center">170</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">7</td> <td>NOR</td> <td>Lando Norris</td> <td class="width-60 text-center">100</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">8</td> <td>OCO</td> <td>Esteban Ocon</td> <td class="width-60 text-center">66</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">9</td> <td>ALO</td> <td>Fernando Alonso</td> <td class="width-60 text-center">59</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">10</td> <td>BOT</td> <td>Valtteri Bottas</td> <td class="width-60 text-center">46</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">11</td> <td>RIC</td> <td>Daniel Ricciardo</td> <td class="width-60 text-center">29</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">12</td> <td>VET</td> <td>Sebastian Vettel</td> <td class="width-60 text-center">24</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">13</td> <td>GAS</td> <td>Pierre Gasly</td> <td class="width-60 text-center">23</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">14</td> <td>MAG</td> <td>Kevin Magnussen</td> <td class="width-60 text-center">22</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">15</td> <td>STR</td> <td>Lance Stroll</td> <td class="width-60 text-center">13</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">16</td> <td>MSC</td> <td>Mick Schumacher</td> <td class="width-60 text-center">12</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">17</td> <td>TSU</td> <td>Yuki Tsunoda</td> <td class="width-60 text-center">11</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">18</td> <td>ZHO</td> <td>Guanyu Zhou</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">19</td> <td>ALB</td> <td>Alexander Albon</td> <td class="width-60 text-center">4</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">20</td> <td>DEV</td> <td>Nyck de Vries</td> <td class="width-60 text-center">2</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">21</td> <td>LAT</td> <td>Nicholas Latifi</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">22</td> <td>HUL</td> <td>Nico Hülkenberg</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> </tbody> </table> </ha-card>');
    }),    
    test('Calling render with hass and config LastResult should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.LastResult
        }        

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>resultData });
        }));

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <tr> <td><h2><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br> <h2><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br> <h2><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br> <h2><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br> </td> </tr> </table> <table> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Sergio Pérez</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Charles Leclerc</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Carlos Sainz</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Lando Norris</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Daniel Ricciardo</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Lance Stroll</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Max Verstappen</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Sebastian Vettel</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Lewis Hamilton</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Pierre Gasly</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Valtteri Bottas</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Kevin Magnussen</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Mick Schumacher</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td>George Russell</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Yuki Tsunoda</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Esteban Ocon</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Alexander Albon</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Fernando Alonso</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Nicholas Latifi</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Guanyu Zhou</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> </table> </ha-card>');
    }),    
    test('Calling render with hass and config NextRace should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.NextRace
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

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <tbody> <tr> <td colspan="5"><h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br> <h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br> <h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br> <h2><img height="25" src="https://flagcdn.com/w40/bh.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br> </td> </tr> <tr><td>Date</td><td>20-03-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:00</td></tr> <tr><td>Race</td><td>1</td><td>&nbsp;</td><td>Practice 2</td><td align="right">vr 16:00</td></tr> <tr><td>Race name</td><td>Bahrain Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">za 13:00</td></tr> <tr><td>Circuit name</td><td>Bahrain International Circuit</td><td>&nbsp;</td><td>Qualifying</td><td align="right">za 16:00</td></tr> <tr><td>Location</td><td>Bahrain</td><td>&nbsp;</td><td>Sprint</td><td align="right">-</td></tr> <tr><td>City</td><td>Sakhir</td><td>&nbsp;</td><td>Race</td><td align="right">zo 16:00</td></tr> </tbody> </table> </ha-card>');
    }),    
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
    }),    
    test('Calling shouldUpdate with config should return true', () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.Schedule
        }
        const props : PropertyValues = new Map([['config', config]]);        

        const result = card['shouldUpdate'](props);

        expect(result).toBeTruthy();
    }),
    test.each`
    type | expected
    ${FormulaOneCardType.ConstructorStandings}, ${11}
    ${FormulaOneCardType.DriverStandings}, ${12}
    ${FormulaOneCardType.LastResult}, ${11}
    ${FormulaOneCardType.NextRace}, ${8}
    ${FormulaOneCardType.Schedule}, ${12}
    `('Calling getCardSize with type should return card size', ({ type, expected }) => {  
        
        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: type.toString()
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));

        card.setConfig(config);
        card.hass = hass;
        card.render();
        expect(card.getCardSize()).toBe(expected);
    }),
    test('Passing empty config should throw warning', () => {   
        
        card.renderCardType = jest.fn().mockImplementationOnce(() => { throw new Error('Error for warning'); });

        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<hui-warning>Error: Error for warning</hui-warning>');
    })
})

