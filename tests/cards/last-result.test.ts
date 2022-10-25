
import LastResult from '../../src/cards/last-result';
import { createMock } from 'ts-auto-mock';
import { HomeAssistant } from 'custom-card-helpers';
import { getRenderString } from '../utils';
import { MRData } from '../testdata/results.json'
import { HassEntity } from 'home-assistant-js-websocket';
import { FormulaOneCardConfig, Race } from '../../src/types/formulaone-card-types';

describe('Testing last-result file', () => {
    const hass = createMock<HomeAssistant>();
    const data = MRData['RaceTable'].Races[0];
    const hassEntity = createMock<HassEntity>();
    const config = createMock<FormulaOneCardConfig>();

    test('Calling render with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  

        const card = new LastResult('sensor.test_sensor_wrong_sensor', hass, config);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (last_result)');
    }),
    test('Calling render with hass and sensor but no data', () => {   
        hassEntity.attributes['last_update'] = new Date();
        hass.states = {
            'sensor.test_sensor_last_result': hassEntity
        };

        const card = new LastResult('sensor.test_sensor_last_result', hass, config);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (last_result)');
    }),
    test('Calling render with hass and sensor', () => {   
        hassEntity.attributes['data'] = data as Race;
        hass.states = {
            'sensor.test_sensor_last_result': hassEntity
        };

        const card = new LastResult('sensor.test_sensor_last_result', hass, config);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<table> <tr> <td><h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Singapore.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br> </td> </tr> </table> <table> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Grid</th> <th class="text-ccenter">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Sergio Pérez</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Charles Leclerc</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Carlos Sainz</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Lando Norris</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Daniel Ricciardo</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Lance Stroll</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Max Verstappen</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Sebastian Vettel</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Lewis Hamilton</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Pierre Gasly</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Valtteri Bottas</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Kevin Magnussen</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Mick Schumacher</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td>George Russell</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Yuki Tsunoda</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Esteban Ocon</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Alexander Albon</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Fernando Alonso</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Nicholas Latifi</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Guanyu Zhou</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> </table>');
    }),
    test('Calling renderHeader with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  
        config.image_clickable = undefined;

        const card = new LastResult('sensor.test_sensor_wrong_sensor', hass, config);
        
        const result = card.renderHeader();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Singapore.png">&nbsp; 17 : Singapore Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"><br>');
    }),
    test('Calling renderHeader clickable image with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  
        config.image_clickable = true;

        const card = new LastResult('sensor.test_sensor_wrong_sensor', hass, config);
        
        const result = card.renderHeader();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Singapore.png">&nbsp; 17 : Singapore Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png"></a><br>');
    })
});