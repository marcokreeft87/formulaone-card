import DriverStandings from '../../src/cards/driver-standings';
import { createMock } from 'ts-auto-mock';
import { getRenderString, getRenderStringAsync } from '../utils';
import { MRData } from '../testdata/driverStandings.json'
import { FormulaOneCardConfig } from '../../src/types/formulaone-card-types';
import ErgastClient from '../../src/api/ergast-client';
import { Mrdata, Root } from '../../src/api/models';
import { getApiErrorMessage } from '../../src/utils';

describe('Testing driver-standings file', () => {
    const config = createMock<FormulaOneCardConfig>();

    const card = new DriverStandings(config);

    test('Calling render with api returning data', async () => {   
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        expect(htmlResult).toMatch('<table> <thead> <tr> <th class="width-50" colspan="2">&nbsp;</th> <th>Driver</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-40 text-center">1</td> <td>VER</td> <td>Max Verstappen</td> <td class="width-60 text-center">341</td> <td class="text-center">11</td> </tr> <tr> <td class="width-40 text-center">2</td> <td>LEC</td> <td>Charles Leclerc</td> <td class="width-60 text-center">237</td> <td class="text-center">3</td> </tr> <tr> <td class="width-40 text-center">3</td> <td>PER</td> <td>Sergio Pérez</td> <td class="width-60 text-center">235</td> <td class="text-center">2</td> </tr> <tr> <td class="width-40 text-center">4</td> <td>RUS</td> <td>George Russell</td> <td class="width-60 text-center">203</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">5</td> <td>SAI</td> <td>Carlos Sainz</td> <td class="width-60 text-center">202</td> <td class="text-center">1</td> </tr> <tr> <td class="width-40 text-center">6</td> <td>HAM</td> <td>Lewis Hamilton</td> <td class="width-60 text-center">170</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">7</td> <td>NOR</td> <td>Lando Norris</td> <td class="width-60 text-center">100</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">8</td> <td>OCO</td> <td>Esteban Ocon</td> <td class="width-60 text-center">66</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">9</td> <td>ALO</td> <td>Fernando Alonso</td> <td class="width-60 text-center">59</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">10</td> <td>BOT</td> <td>Valtteri Bottas</td> <td class="width-60 text-center">46</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">11</td> <td>RIC</td> <td>Daniel Ricciardo</td> <td class="width-60 text-center">29</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">12</td> <td>VET</td> <td>Sebastian Vettel</td> <td class="width-60 text-center">24</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">13</td> <td>GAS</td> <td>Pierre Gasly</td> <td class="width-60 text-center">23</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">14</td> <td>MAG</td> <td>Kevin Magnussen</td> <td class="width-60 text-center">22</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">15</td> <td>STR</td> <td>Lance Stroll</td> <td class="width-60 text-center">13</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">16</td> <td>MSC</td> <td>Mick Schumacher</td> <td class="width-60 text-center">12</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">17</td> <td>TSU</td> <td>Yuki Tsunoda</td> <td class="width-60 text-center">11</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">18</td> <td>ZHO</td> <td>Guanyu Zhou</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">19</td> <td>ALB</td> <td>Alexander Albon</td> <td class="width-60 text-center">4</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">20</td> <td>DEV</td> <td>Nyck de Vries</td> <td class="width-60 text-center">2</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">21</td> <td>LAT</td> <td>Nicholas Latifi</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">22</td> <td>HUL</td> <td>Nico Hülkenberg</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> </tbody> </table>');
    }),
    test('Calling render with api returning data and showing flag and team', async () => {   
        
        config.standings = {
            show_flag: true,
            show_team: true
        } 
        const flagCard = new DriverStandings(config);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = flagCard.render();
        const htmlResult = await getRenderStringAsync(result);

        expect(htmlResult).toMatch('<table> <thead> <tr> <th class="width-50" colspan="2">&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-40 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/nl.png">&nbsp;VER</td> <td>Max Verstappen</td> <td>Red Bull</td> <td class="width-60 text-center">341</td> <td class="text-center">11</td> </tr> <tr> <td class="width-40 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/mc.png">&nbsp;LEC</td> <td>Charles Leclerc</td> <td>Ferrari</td> <td class="width-60 text-center">237</td> <td class="text-center">3</td> </tr> <tr> <td class="width-40 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/mx.png">&nbsp;PER</td> <td>Sergio Pérez</td> <td>Red Bull</td> <td class="width-60 text-center">235</td> <td class="text-center">2</td> </tr> <tr> <td class="width-40 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/gb.png">&nbsp;RUS</td> <td>George Russell</td> <td>Mercedes</td> <td class="width-60 text-center">203</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/es.png">&nbsp;SAI</td> <td>Carlos Sainz</td> <td>Ferrari</td> <td class="width-60 text-center">202</td> <td class="text-center">1</td> </tr> <tr> <td class="width-40 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/gb.png">&nbsp;HAM</td> <td>Lewis Hamilton</td> <td>Mercedes</td> <td class="width-60 text-center">170</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/gb.png">&nbsp;NOR</td> <td>Lando Norris</td> <td>McLaren</td> <td class="width-60 text-center">100</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/fr.png">&nbsp;OCO</td> <td>Esteban Ocon</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">66</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/es.png">&nbsp;ALO</td> <td>Fernando Alonso</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">59</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/fi.png">&nbsp;BOT</td> <td>Valtteri Bottas</td> <td>Alfa Romeo</td> <td class="width-60 text-center">46</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/au.png">&nbsp;RIC</td> <td>Daniel Ricciardo</td> <td>McLaren</td> <td class="width-60 text-center">29</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/de.png">&nbsp;VET</td> <td>Sebastian Vettel</td> <td>Aston Martin</td> <td class="width-60 text-center">24</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/fr.png">&nbsp;GAS</td> <td>Pierre Gasly</td> <td>AlphaTauri</td> <td class="width-60 text-center">23</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/dk.png">&nbsp;MAG</td> <td>Kevin Magnussen</td> <td>Haas F1 Team</td> <td class="width-60 text-center">22</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/ca.png">&nbsp;STR</td> <td>Lance Stroll</td> <td>Aston Martin</td> <td class="width-60 text-center">13</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/de.png">&nbsp;MSC</td> <td>Mick Schumacher</td> <td>Haas F1 Team</td> <td class="width-60 text-center">12</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/jp.png">&nbsp;TSU</td> <td>Yuki Tsunoda</td> <td>AlphaTauri</td> <td class="width-60 text-center">11</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/cn.png">&nbsp;ZHO</td> <td>Guanyu Zhou</td> <td>Alfa Romeo</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/th.png">&nbsp;ALB</td> <td>Alexander Albon</td> <td>Williams</td> <td class="width-60 text-center">4</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/nl.png">&nbsp;DEV</td> <td>Nyck de Vries</td> <td>Williams</td> <td class="width-60 text-center">2</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">21</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/ca.png">&nbsp;LAT</td> <td>Nicholas Latifi</td> <td>Williams</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> <tr> <td class="width-40 text-center">22</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/de.png">&nbsp;HUL</td> <td>Nico Hülkenberg</td> <td>Aston Martin</td> <td class="width-60 text-center">0</td> <td class="text-center">0</td> </tr> </tbody> </table>');
    }),
    test('Calling render with api not returning data', async () => {   
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getApiErrorMessage('standings'));

        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling cardSize with hass and sensor', () => { 
        expect(card.cardSize()).toBe(12);
    })
});