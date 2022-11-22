
import NextRace from '../../src/cards/next-race';
import { createMock } from 'ts-auto-mock';
import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { getRenderString } from '../utils';
import { MRData } from '../testdata/schedule.json'
import { HassEntity } from 'home-assistant-js-websocket';
import { FormulaOneCardConfig, Race } from '../../src/types/formulaone-card-types';

describe('Testing next-race file', () => {
    const hass = createMock<HomeAssistant>();
    hass.locale = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }
    
    const config = createMock<FormulaOneCardConfig>();
    const data = MRData['RaceTable'].Races[0];
    const hassEntity = createMock<HassEntity>();

    test('Calling render with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  

        const card = new NextRace('sensor.test_sensor_wrong_sensor', hass, config);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (races)');
    }),
    test('Calling render with hass and sensor but no data', () => {   
        hassEntity.attributes['last_update'] = new Date();
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new NextRace('sensor.test_sensor_races', hass, config);
        expect(() => card.render()).toThrowError('Please pass the correct sensor (races)');
    }),
    test('Calling render with hass and sensor', () => {   
        hassEntity.attributes['next_race'] = data as Race;
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new NextRace('sensor.test_sensor_races', hass, config);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Bahrain.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br> </td> </tr> <tr><td>Date</td><td>20-03-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:00</td></tr> <tr><td>Race</td><td>1</td><td>&nbsp;</td><td>Practice 2</td><td align="right">vr 16:00</td></tr> <tr><td>Race name</td><td>Bahrain Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">za 13:00</td></tr> <tr><td>Circuit name</td><td>Bahrain International Circuit</td><td>&nbsp;</td><td>Qualifying</td><td align="right">za 16:00</td></tr> <tr><td>Location</td><td>Bahrain</td><td>&nbsp;</td><td>Sprint</td><td align="right">-</td></tr> <tr><td>City</td><td>Sakhir</td><td>&nbsp;</td><td>Race</td><td align="right">zo 16:00</td></tr> </tbody> </table>');
    }),
    test('Calling renderHeader with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  
        config.image_clickable = undefined;

        const card = new NextRace('sensor.test_sensor_wrong_sensor', hass, config);
        
        const result = card.renderHeader();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Bahrain.png">&nbsp; 1 : Bahrain Grand Prix</h2><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"><br>');
    }),
    test('Calling renderHeader clickable image with hass and wrong sensor', () => { 
        hass.states = {
            'sensor.test_sensor_wrong_sensor': hassEntity
        };  
        config.image_clickable = true;

        const card = new NextRace('sensor.test_sensor_wrong_sensor', hass, config);
        
        const result = card.renderHeader();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Bahrain.png">&nbsp; 1 : Bahrain Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Bahrain_International_Circuit"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"></a><br>');
    }),
    test('Calling render without Qualifying with hass and sensor', () => {   
        const raceData = data as Race;
        raceData.Qualifying = undefined;
        hassEntity.attributes['next_race'] = raceData;
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new NextRace('sensor.test_sensor_races', hass, config);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Bahrain.png">&nbsp; 1 : Bahrain Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Bahrain_International_Circuit"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"></a><br> </td> </tr> <tr><td>Date</td><td>20-03-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:00</td></tr> <tr><td>Race</td><td>1</td><td>&nbsp;</td><td>Practice 2</td><td align="right">vr 16:00</td></tr> <tr><td>Race name</td><td>Bahrain Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">za 13:00</td></tr> <tr><td>Circuit name</td><td>Bahrain International Circuit</td><td>&nbsp;</td><td>Qualifying</td><td align="right">-</td></tr> <tr><td>Location</td><td>Bahrain</td><td>&nbsp;</td><td>Sprint</td><td align="right">-</td></tr> <tr><td>City</td><td>Sakhir</td><td>&nbsp;</td><td>Race</td><td align="right">zo 16:00</td></tr> </tbody> </table>');
    }),
    test('Calling render with Sprint with hass and sensor', () => {   
        const raceData = data as Race;
        raceData.ThirdPractice = undefined;
        raceData.Sprint = {
            date: '2022-03-20',
            time: '10:00'
        };
        hassEntity.attributes['next_race'] = raceData;
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new NextRace('sensor.test_sensor_races', hass, config);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<table> <tbody> <tr> <td colspan="5"><h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-Bahrain.png">&nbsp; 1 : Bahrain Grand Prix</h2><a target="_new" href="http://en.wikipedia.org/wiki/Bahrain_International_Circuit"><img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/7col/image.png"></a><br> </td> </tr> <tr><td>Date</td><td>20-03-22</td><td>&nbsp;</td><td>Practice 1</td><td align="right">vr 13:00</td></tr> <tr><td>Race</td><td>1</td><td>&nbsp;</td><td>Practice 2</td><td align="right">vr 16:00</td></tr> <tr><td>Race name</td><td>Bahrain Grand Prix</td><td>&nbsp;</td><td>Practice 3</td><td align="right">-</td></tr> <tr><td>Circuit name</td><td>Bahrain International Circuit</td><td>&nbsp;</td><td>Qualifying</td><td align="right">-</td></tr> <tr><td>Location</td><td>Bahrain</td><td>&nbsp;</td><td>Sprint</td><td align="right">zo 10:00</td></tr> <tr><td>City</td><td>Sakhir</td><td>&nbsp;</td><td>Race</td><td align="right">zo 16:00</td></tr> </tbody> </table>');
    }),
    test('Calling render with hass and sensor when season ended', () => {   
        hassEntity.attributes['next_race'] = null;
        hass.states = {
            'sensor.test_sensor_races': hassEntity
        };

        const card = new NextRace('sensor.test_sensor_races', hass, config);
        const result = card.render();
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<table><tr><td class="text-center"><strong>Season is over. See you next year!</strong></td></tr></table>');
    })
});