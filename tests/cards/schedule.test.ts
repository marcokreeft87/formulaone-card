
import Schedule from '../../src/cards/schedule';
import { createMock } from 'ts-auto-mock';
import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { getRenderString } from '../utils';
import { MRData } from '../testdata/schedule.json'
import { HassEntity } from 'home-assistant-js-websocket';
import { FormulaOneCardConfig, Race } from '../../src/types/formulaone-card-types';

describe('Testing schedule file', () => {
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }
    
    const config = createMock<FormulaOneCardConfig>();
    const data = MRData['RaceTable'].Races;
    const hassEntity = createMock<HassEntity>();

    test('Calling render with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  

        const card = new Schedule('sensor.test_sensor_wrong_sensor', hass, config);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (races)');
    }),
    test('Calling render with hass and sensor but no data', () => {   
        hassEntity.attributes['last_update'] = new Date();
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new Schedule('sensor.test_sensor_races', hass, config);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (races)');
    }),
    test('Calling render with hass and sensor', () => {   
        hassEntity.attributes['data'] = data as Race[];
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new Schedule('sensor.test_sensor_races', hass, config);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch(' <table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Bahrain International Circuit</td> <td>Sakhir, Bahrain</td> <td class="width-60 text-center">20-03</td> <td class="text-center">16:00</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Jeddah Corniche Circuit</td> <td>Jeddah, Saudi Arabia</td> <td class="width-60 text-center">27-03</td> <td class="text-center">19:00</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Albert Park Grand Prix Circuit</td> <td>Melbourne, Australia</td> <td class="width-60 text-center">10-04</td> <td class="text-center">7:00</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Autodromo Enzo e Dino Ferrari</td> <td>Imola, Italy</td> <td class="width-60 text-center">24-04</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Miami International Autodrome</td> <td>Miami, USA</td> <td class="width-60 text-center">08-05</td> <td class="text-center">21:30</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Circuit de Barcelona-Catalunya</td> <td>Montmeló, Spain</td> <td class="width-60 text-center">22-05</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Circuit de Monaco</td> <td>Monte-Carlo, Monaco</td> <td class="width-60 text-center">29-05</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Baku City Circuit</td> <td>Baku, Azerbaijan</td> <td class="width-60 text-center">12-06</td> <td class="text-center">13:00</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Circuit Gilles Villeneuve</td> <td>Montreal, Canada</td> <td class="width-60 text-center">19-06</td> <td class="text-center">20:00</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Silverstone Circuit</td> <td>Silverstone, UK</td> <td class="width-60 text-center">03-07</td> <td class="text-center">16:00</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Red Bull Ring</td> <td>Spielberg, Austria</td> <td class="width-60 text-center">10-07</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Circuit Paul Ricard</td> <td>Le Castellet, France</td> <td class="width-60 text-center">24-07</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Hungaroring</td> <td>Budapest, Hungary</td> <td class="width-60 text-center">31-07</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">14</td> <td>Circuit de Spa-Francorchamps</td> <td>Spa, Belgium</td> <td class="width-60 text-center">28-08</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Circuit Park Zandvoort</td> <td>Zandvoort, Netherlands</td> <td class="width-60 text-center">04-09</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Autodromo Nazionale di Monza</td> <td>Monza, Italy</td> <td class="width-60 text-center">11-09</td> <td class="text-center">15:00</td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Marina Bay Street Circuit</td> <td>Marina Bay, Singapore</td> <td class="width-60 text-center">02-10</td> <td class="text-center">14:00</td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Suzuka Circuit</td> <td>Suzuka, Japan</td> <td class="width-60 text-center">09-10</td> <td class="text-center">7:00</td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Circuit of the Americas</td> <td>Austin, USA</td> <td class="width-60 text-center">23-10</td> <td class="text-center">21:00</td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Autódromo Hermanos Rodríguez</td> <td>Mexico City, Mexico</td> <td class="width-60 text-center">30-10</td> <td class="text-center">21:00</td> </tr> <tr> <td class="width-50 text-center">21</td> <td>Autódromo José Carlos Pace</td> <td>São Paulo, Brazil</td> <td class="width-60 text-center">13-11</td> <td class="text-center">19:00</td> </tr> <tr> <td class="width-50 text-center">22</td> <td>Yas Marina Circuit</td> <td>Abu Dhabi, UAE</td> <td class="width-60 text-center">20-11</td> <td class="text-center">14:00</td> </tr> </tbody> </table> ');
    })
});