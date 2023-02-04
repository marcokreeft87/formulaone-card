import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { createMock } from 'ts-auto-mock';
import FormulaOneCard from '../src/index';
import { CardProperties, FormulaOneCardConfig, FormulaOneCardType } from '../src/types/formulaone-card-types';
import { getRenderString, getRenderStringAsyncIndex } from './utils';
import { LitElement, PropertyValues } from 'lit';
import { Mrdata, Root } from '../src/api/models';
import { MRData as scheduleData } from './testdata/schedule.json'
import { MRData as constructorStandingsData } from './testdata/constructorStandings.json'
import { MRData as driverStandingsData } from './testdata/driverStandings.json'
import { MRData as resultData } from './testdata/results.json'
import { MRData as seasonData } from './testdata/seasons.json'
import { MRData as qualifyingData } from './testdata/qualifying.json'
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

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1><h1 class="card-header">Test</h1> <table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Red Bull</td> <td class="width-60 text-center">576</td> <td class="text-center">13</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Ferrari</td> <td class="width-60 text-center">439</td> <td class="text-center">4</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Mercedes</td> <td class="width-60 text-center">373</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>McLaren</td> <td class="width-60 text-center">129</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">125</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Alfa Romeo</td> <td class="width-60 text-center">52</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Aston Martin</td> <td class="width-60 text-center">37</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Haas F1 Team</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>AlphaTauri</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Williams</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> </tbody> </table> </ha-card>');
    }),    
    test('Calling render with hass and config DriverStanding should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
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

        expect(htmlResult).toMatch('<ha-card elevation="2"> <table> <thead> <tr> <th class="width-50" colspan="2">&nbsp;</th> <th>Driver</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-40 text-center">1</td> <td>VER</td> <td>Max Verstappen</td> <td class="width-60 text-center">341</td> <td class="text-center">11</td> </tr> <tr> <td class="width-40 text-center">2</td> <td>LEC</td> <td>Charles Leclerc</td> <td class="width-60 text-center">237</td> <td class="text-center">3</td> </tr> <tr> <td class="width-40 text-center">3</td> <td>PER</td> <td>Sergio Pérez</td> <td class="width-60 text-center">235</td> <td class="text-center">2</td> </tr> <tr> <td class="width-40 text-center">4</td> <td>RUS</td> <td>George Russell</td> <td class="width-60 text-center">203</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">5</td> <td>SAI</td> <td>Carlos Sainz</td> <td class="width-60 text-center">202</td> <td class="text-center">1</td> </tr> <tr> <td class="width-40 text-center">6</td> <td>HAM</td> <td>Lewis Hamilton</td> <td class="width-60 text-center">170</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">7</td> <td>NOR</td> <td>Lando Norris</td> <td class="width-60 text-center">100</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">8</td> <td>OCO</td> <td>Esteban Ocon</td> <td class="width-60 text-center">66</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">9</td> <td>ALO</td> <td>Fernando Alonso</td> <td class="width-60 text-center">59</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">10</td> <td>BOT</td> <td>Valtteri Bottas</td> <td class="width-60 text-center">46</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">11</td> <td>RIC</td> <td>Daniel Ricciardo</td> <td class="width-60 text-center">29</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">12</td> <td>VET</td> <td>Sebastian Vettel</td> <td class="width-60 text-center">24</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">13</td> <td>GAS</td> <td>Pierre Gasly</td> <td class="width-60 text-center">23</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">14</td> <td>MAG</td> <td>Kevin Magnussen</td> <td class="width-60 text-center">22</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">15</td> <td>STR</td> <td>Lance Stroll</td> <td class="width-60 text-center">13</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">16</td> <td>MSC</td> <td>Mick Schumacher</td> <td class="width-60 text-center">12</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">17</td> <td>TSU</td> <td>Yuki Tsunoda</td> <td class="width-60 text-center">11</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">18</td> <td>ZHO</td> <td>Guanyu Zhou</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">19</td> <td>ALB</td> <td>Alexander Albon</td> <td class="width-60 text-center">4</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">20</td> <td>DEV</td> <td>Nyck de Vries</td> <td class="width-60 text-center">2</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">21</td> <td>LAT</td> <td>Nicholas Latifi</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">22</td> <td>HUL</td> <td>Nico Hülkenberg</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> </tbody> </table> </ha-card>');
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

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1><h1 class="card-header">Test</h1> <table> <tr> <td><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 17 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action= .actionHandler= class="" /><br></td> </tr> </table> <table> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Sergio Pérez</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Charles Leclerc</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Carlos Sainz</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Lando Norris</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Daniel Ricciardo</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Lance Stroll</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Max Verstappen</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Sebastian Vettel</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Lewis Hamilton</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Pierre Gasly</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Valtteri Bottas</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Kevin Magnussen</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Mick Schumacher</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td>George Russell</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Yuki Tsunoda</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Esteban Ocon</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Alexander Albon</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Fernando Alonso</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Nicholas Latifi</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Guanyu Zhou</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> </table> </ha-card>');
    }),
    test('Calling render with hass and config Results should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.Results
        }                
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
        jest.spyOn(LitElement.prototype as any, 'update').mockImplementationOnce(() => { });

        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementation((_endpoint) => {
            if(_endpoint === '2022/2/results.json`') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>resultData });
                });
            }

            if(_endpoint === 'seasons.json?limit=200') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>seasonData });
                });
            }
    
            return new Promise<Root>((resolve) => {
                resolve({ MRData : <Mrdata>scheduleData });
            });
        });

        card.setConfig(config);
        card.hass = hass;
        const result = card.render();
        const htmlResult = await getRenderStringAsyncIndex(result);

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1><h1 class="card-header">Test</h1> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> <table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table> </ha-card>');
    }),  
    test('Calling render with hass and config QualifyingResults should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.QualifyingResults
        }                
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
        jest.spyOn(LitElement.prototype as any, 'update').mockImplementationOnce(() => { });

        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementation((_endpoint) => {
            if(_endpoint === '2022/2/qualifying.json`') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>qualifyingData });
                });
            }

            if(_endpoint === 'seasons.json?limit=200') {
                return new Promise<Root>((resolve) => {
                    resolve({ MRData : <Mrdata>seasonData });
                });
            }
    
            return new Promise<Root>((resolve) => {
                resolve({ MRData : <Mrdata>scheduleData });
            });
        });

        card.setConfig(config);
        card.hass = hass;
        
        let cardProperties = card.card.parent.properties.get('cardValues') as CardProperties
        cardProperties.selectedRace = qualifyingData.RaceTable.Races[0];

        const result = card.render();
        const htmlResult = await getRenderString(result);

        jest.spyOn(ErgastClient.prototype, 'GetData').mockRestore();

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1> <table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr></table> <table> <thead> <tr> <td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w40/mx.png">&nbsp; 20 : Mexico City Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td> </tr> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Q1</th> <th class="text-center">Q2</th> <th class="text-center">Q3</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Max Verstappen</td> <td>1:19.222</td> <td>1:18.566</td> <td>1:17.775</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>George Russell</td> <td>1:19.583</td> <td>1:18.565</td> <td>1:18.079</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Lewis Hamilton</td> <td>1:19.169</td> <td>1:18.552</td> <td>1:18.084</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Sergio Pérez</td> <td>1:19.706</td> <td>1:18.615</td> <td>1:18.128</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Carlos Sainz</td> <td>1:19.566</td> <td>1:18.560</td> <td>1:18.351</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Valtteri Bottas</td> <td>1:19.523</td> <td>1:18.762</td> <td>1:18.401</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Charles Leclerc</td> <td>1:19.505</td> <td>1:19.109</td> <td>1:18.555</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Lando Norris</td> <td>1:19.857</td> <td>1:19.119</td> <td>1:18.721</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Fernando Alonso</td> <td>1:20.006</td> <td>1:19.272</td> <td>1:18.939</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Esteban Ocon</td> <td>1:19.945</td> <td>1:19.081</td> <td>1:19.010</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Daniel Ricciardo</td> <td>1:20.279</td> <td>1:19.325</td> <td></td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Guanyu Zhou</td> <td>1:20.283</td> <td>1:19.476</td> <td></td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Yuki Tsunoda</td> <td>1:19.907</td> <td>1:19.589</td> <td></td> </tr> <tr> <td class="width-50 text-center">14</td> <td>Pierre Gasly</td> <td>1:20.256</td> <td>1:19.672</td> <td></td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Kevin Magnussen</td> <td>1:20.293</td> <td>1:19.833</td> <td></td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Mick Schumacher</td> <td>1:20.419</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Sebastian Vettel</td> <td>1:20.419</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Lance Stroll</td> <td>1:20.520</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Alexander Albon</td> <td>1:20.859</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Nicholas Latifi</td> <td>1:21.167</td> <td></td> <td></td> </tr> </tbody> </table> </ha-card>');
    }), 
    test('Calling render with hass and config NextRace should return expected html', async () => {   

        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: FormulaOneCardType.NextRace,
            f1_font: true
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
        const htmlResult = await getRenderString(result);

        jest.useRealTimers();

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header formulaone-font">Test</h1> </ha-card>');
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

        expect(htmlResult).toMatch('<ha-card elevation="2"> <h1 class="card-header">Test</h1><h1 class="card-header">Test</h1> <table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> <tr class=""> <td class="width-50 text-center">1</td> <td>Bahrain International Circuit</td> <td>Sakhir, BahrainSakhir, BahrainSakhir, Bahrain</td> <td class="width-60 text-center">20-03</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">2</td> <td>Jeddah Corniche Circuit</td> <td>Jeddah, Saudi ArabiaJeddah, Saudi ArabiaJeddah, Saudi Arabia</td> <td class="width-60 text-center">27-03</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">3</td> <td>Albert Park Grand Prix Circuit</td> <td>Melbourne, AustraliaMelbourne, AustraliaMelbourne, Australia</td> <td class="width-60 text-center">10-04</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">4</td> <td>Autodromo Enzo e Dino Ferrari</td> <td>Imola, ItalyImola, ItalyImola, Italy</td> <td class="width-60 text-center">24-04</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">5</td> <td>Miami International Autodrome</td> <td>Miami, USAMiami, USAMiami, USA</td> <td class="width-60 text-center">08-05</td> <td class="width-50 text-center">21:30</td> </tr> <tr class=""> <td class="width-50 text-center">6</td> <td>Circuit de Barcelona-Catalunya</td> <td>Montmeló, SpainMontmeló, SpainMontmeló, Spain</td> <td class="width-60 text-center">22-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">7</td> <td>Circuit de Monaco</td> <td>Monte-Carlo, MonacoMonte-Carlo, MonacoMonte-Carlo, Monaco</td> <td class="width-60 text-center">29-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">8</td> <td>Baku City Circuit</td> <td>Baku, AzerbaijanBaku, AzerbaijanBaku, Azerbaijan</td> <td class="width-60 text-center">12-06</td> <td class="width-50 text-center">13:00</td> </tr> <tr class=""> <td class="width-50 text-center">9</td> <td>Circuit Gilles Villeneuve</td> <td>Montreal, CanadaMontreal, CanadaMontreal, Canada</td> <td class="width-60 text-center">19-06</td> <td class="width-50 text-center">20:00</td> </tr> <tr class=""> <td class="width-50 text-center">10</td> <td>Silverstone Circuit</td> <td>Silverstone, UKSilverstone, UKSilverstone, UK</td> <td class="width-60 text-center">03-07</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">11</td> <td>Red Bull Ring</td> <td>Spielberg, AustriaSpielberg, AustriaSpielberg, Austria</td> <td class="width-60 text-center">10-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">12</td> <td>Circuit Paul Ricard</td> <td>Le Castellet, FranceLe Castellet, FranceLe Castellet, France</td> <td class="width-60 text-center">24-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">13</td> <td>Hungaroring</td> <td>Budapest, HungaryBudapest, HungaryBudapest, Hungary</td> <td class="width-60 text-center">31-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">14</td> <td>Circuit de Spa-Francorchamps</td> <td>Spa, BelgiumSpa, BelgiumSpa, Belgium</td> <td class="width-60 text-center">28-08</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">15</td> <td>Circuit Park Zandvoort</td> <td>Zandvoort, NetherlandsZandvoort, NetherlandsZandvoort, Netherlands</td> <td class="width-60 text-center">04-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">16</td> <td>Autodromo Nazionale di Monza</td> <td>Monza, ItalyMonza, ItalyMonza, Italy</td> <td class="width-60 text-center">11-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">17</td> <td>Marina Bay Street Circuit</td> <td>Marina Bay, SingaporeMarina Bay, SingaporeMarina Bay, Singapore</td> <td class="width-60 text-center">02-10</td> <td class="width-50 text-center">14:00</td> </tr> <tr class=""> <td class="width-50 text-center">18</td> <td>Suzuka Circuit</td> <td>Suzuka, JapanSuzuka, JapanSuzuka, Japan</td> <td class="width-60 text-center">09-10</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">19</td> <td>Circuit of the Americas</td> <td>Austin, USAAustin, USAAustin, USA</td> <td class="width-60 text-center">23-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">20</td> <td>Autódromo Hermanos Rodríguez</td> <td>Mexico City, MexicoMexico City, MexicoMexico City, Mexico</td> <td class="width-60 text-center">30-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">21</td> <td>Autódromo José Carlos Pace</td> <td>São Paulo, BrazilSão Paulo, BrazilSão Paulo, Brazil</td> <td class="width-60 text-center">13-11</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">22</td> <td>Yas Marina Circuit</td> <td>Abu Dhabi, UAEAbu Dhabi, UAEAbu Dhabi, UAE</td> <td class="width-60 text-center">20-11</td> <td class="width-50 text-center">14:00</td> </tr> </tbody> </table> </ha-card>');
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
    ${FormulaOneCardType.Results}, ${11}
    ${FormulaOneCardType.Countdown}, ${6}
    ${FormulaOneCardType.QualifyingResults}, ${11}
    `('Calling getCardSize with type should return card size', ({ type, expected }) => {  
        
        const config: FormulaOneCardConfig = {
            type: '',
            title: 'Test',
            card_type: type.toString()
        }

        card.setConfig(config);
        card.hass = hass;
        expect(card.getCardSize()).toBe(expected);
    }),
    test('Passing empty config should throw warning', () => {   
        
        card.card.render = jest.fn().mockImplementationOnce(() => { throw new Error('Error for warning'); });

        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<hui-warning>Error: Error for warning</hui-warning>');
    }),
    test('Setting cardValues should trigger update and values should be set', () => {           
        
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
        const updateSpy = jest.spyOn(LitElement.prototype as any, 'update').mockImplementationOnce(() => { });

        card.properties = new Map([['races', []]]);

        expect(updateSpy).toHaveBeenCalled();
        expect(card.properties).toEqual(new Map([['races', []]]));
    })
})

