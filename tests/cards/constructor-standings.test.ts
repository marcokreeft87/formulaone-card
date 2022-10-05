
import ConstructorStandings from '../../src/cards/constructor-standings';
import { createMock } from 'ts-auto-mock';
import { HomeAssistant } from 'custom-card-helpers';
import { getRenderString } from '../utils';
import { MRData } from '../testdata/constructorStandings.json'
import { HassEntity } from 'home-assistant-js-websocket';
import { ConstructorStanding } from '../../src/types/formulaone-card-types';

describe('Testing constructor-standings file', () => {
    const hass = createMock<HomeAssistant>();
    const data = MRData['StandingsTable']['StandingsLists'][0]['ConstructorStandings'];
    const hassEntity = createMock<HassEntity>();

    test('Calling render with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  

        const card = new ConstructorStandings('sensor.test_sensor_wrong_sensor', hass);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (constructors)');
    }),
    test('Calling render with hass and sensor but no data', () => {   
        hassEntity.attributes['last_update'] = new Date();
        hass.states = {
            'sensor.test_sensor_constructors': hassEntity
        };

        const card = new ConstructorStandings('sensor.test_sensor_constructors', hass);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (constructors)');
    }),
    test('Calling render with hass and sensor', () => {   
        hassEntity.attributes['data'] = data as ConstructorStanding[];
        hass.states = {
            'sensor.test_sensor_constructors': hassEntity
        };

        const card = new ConstructorStandings('sensor.test_sensor_constructors', hass);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Red Bull</td> <td class="width-60 text-center">576</td> <td class="text-center">13</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Ferrari</td> <td class="width-60 text-center">439</td> <td class="text-center">4</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Mercedes</td> <td class="width-60 text-center">373</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>McLaren</td> <td class="width-60 text-center">129</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">125</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Alfa Romeo</td> <td class="width-60 text-center">52</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Aston Martin</td> <td class="width-60 text-center">37</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Haas F1 Team</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>AlphaTauri</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Williams</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> </tbody> </table>');
    })
});