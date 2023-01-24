import Schedule from '../../src/cards/schedule';
import { createMock } from 'ts-auto-mock';
import { HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';
import { getRenderString, getRenderStringAsync } from '../utils';
import { MRData } from '../testdata/schedule.json'
import { FormulaOneCardConfig, PreviousRaceDisplay } from '../../src/types/formulaone-card-types';
import ErgastClient from '../../src/api/ergast-client';
import { Mrdata, Root } from '../../src/api/models';
import { getApiErrorMessage, getEndOfSeasonMessage } from '../../src/utils';
import FormulaOneCard from '../../src';

describe('Testing schedule file', () => {
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

    test('Calling render with api returning data', async () => {   
        const card = new Schedule(parent);

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        
        jest.useRealTimers();
        expect(htmlResult).toMatch('<table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> <tr class=""> <td class="width-50 text-center">1</td> <td>Bahrain International Circuit</td> <td>Sakhir, Bahrain</td> <td class="width-60 text-center">20-03</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">2</td> <td>Jeddah Corniche Circuit</td> <td>Jeddah, Saudi Arabia</td> <td class="width-60 text-center">27-03</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">3</td> <td>Albert Park Grand Prix Circuit</td> <td>Melbourne, Australia</td> <td class="width-60 text-center">10-04</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">4</td> <td>Autodromo Enzo e Dino Ferrari</td> <td>Imola, Italy</td> <td class="width-60 text-center">24-04</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">5</td> <td>Miami International Autodrome</td> <td>Miami, USA</td> <td class="width-60 text-center">08-05</td> <td class="width-50 text-center">21:30</td> </tr> <tr class=""> <td class="width-50 text-center">6</td> <td>Circuit de Barcelona-Catalunya</td> <td>Montmeló, Spain</td> <td class="width-60 text-center">22-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">7</td> <td>Circuit de Monaco</td> <td>Monte-Carlo, Monaco</td> <td class="width-60 text-center">29-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">8</td> <td>Baku City Circuit</td> <td>Baku, Azerbaijan</td> <td class="width-60 text-center">12-06</td> <td class="width-50 text-center">13:00</td> </tr> <tr class=""> <td class="width-50 text-center">9</td> <td>Circuit Gilles Villeneuve</td> <td>Montreal, Canada</td> <td class="width-60 text-center">19-06</td> <td class="width-50 text-center">20:00</td> </tr> <tr class=""> <td class="width-50 text-center">10</td> <td>Silverstone Circuit</td> <td>Silverstone, UK</td> <td class="width-60 text-center">03-07</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">11</td> <td>Red Bull Ring</td> <td>Spielberg, Austria</td> <td class="width-60 text-center">10-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">12</td> <td>Circuit Paul Ricard</td> <td>Le Castellet, France</td> <td class="width-60 text-center">24-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">13</td> <td>Hungaroring</td> <td>Budapest, Hungary</td> <td class="width-60 text-center">31-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">14</td> <td>Circuit de Spa-Francorchamps</td> <td>Spa, Belgium</td> <td class="width-60 text-center">28-08</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">15</td> <td>Circuit Park Zandvoort</td> <td>Zandvoort, Netherlands</td> <td class="width-60 text-center">04-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">16</td> <td>Autodromo Nazionale di Monza</td> <td>Monza, Italy</td> <td class="width-60 text-center">11-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">17</td> <td>Marina Bay Street Circuit</td> <td>Marina Bay, Singapore</td> <td class="width-60 text-center">02-10</td> <td class="width-50 text-center">14:00</td> </tr> <tr class=""> <td class="width-50 text-center">18</td> <td>Suzuka Circuit</td> <td>Suzuka, Japan</td> <td class="width-60 text-center">09-10</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">19</td> <td>Circuit of the Americas</td> <td>Austin, USA</td> <td class="width-60 text-center">23-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">20</td> <td>Autódromo Hermanos Rodríguez</td> <td>Mexico City, Mexico</td> <td class="width-60 text-center">30-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">21</td> <td>Autódromo José Carlos Pace</td> <td>São Paulo, Brazil</td> <td class="width-60 text-center">13-11</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">22</td> <td>Yas Marina Circuit</td> <td>Abu Dhabi, UAE</td> <td class="width-60 text-center">20-11</td> <td class="width-50 text-center">14:00</td> </tr> </tbody> </table>');
    }),
    test('Calling render with api not returning data', async () => {   
        const card = new Schedule(parent);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getApiErrorMessage('schedule'));

        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling render with api returning data at end of season', async () => {   
        const card = new Schedule(parent);

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 11, 30)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getEndOfSeasonMessage('Season is over. See you next year!'));

        jest.useRealTimers();
        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling render with api returning data and location clickable', async () => {           
        const card = new Schedule(parent);
        card.config.location_clickable = true;

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 1)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        jest.useRealTimers();
        expect(htmlResult).toMatch('<table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> <tr class=""> <td class="width-50 text-center">1</td> <td>Bahrain International Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Bahrain_International_Circuit" target="_blank">Sakhir, Bahrain</a></td> <td class="width-60 text-center">20-03</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">2</td> <td>Jeddah Corniche Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Jeddah_Street_Circuit" target="_blank">Jeddah, Saudi Arabia</a></td> <td class="width-60 text-center">27-03</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">3</td> <td>Albert Park Grand Prix Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit" target="_blank">Melbourne, Australia</a></td> <td class="width-60 text-center">10-04</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">4</td> <td>Autodromo Enzo e Dino Ferrari</td> <td><a href="http://en.wikipedia.org/wiki/Autodromo_Enzo_e_Dino_Ferrari" target="_blank">Imola, Italy</a></td> <td class="width-60 text-center">24-04</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">5</td> <td>Miami International Autodrome</td> <td><a href="http://en.wikipedia.org/wiki/Miami_International_Autodrome" target="_blank">Miami, USA</a></td> <td class="width-60 text-center">08-05</td> <td class="width-50 text-center">21:30</td> </tr> <tr class=""> <td class="width-50 text-center">6</td> <td>Circuit de Barcelona-Catalunya</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya" target="_blank">Montmeló, Spain</a></td> <td class="width-60 text-center">22-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">7</td> <td>Circuit de Monaco</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_de_Monaco" target="_blank">Monte-Carlo, Monaco</a></td> <td class="width-60 text-center">29-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">8</td> <td>Baku City Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Baku_City_Circuit" target="_blank">Baku, Azerbaijan</a></td> <td class="width-60 text-center">12-06</td> <td class="width-50 text-center">13:00</td> </tr> <tr class=""> <td class="width-50 text-center">9</td> <td>Circuit Gilles Villeneuve</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve" target="_blank">Montreal, Canada</a></td> <td class="width-60 text-center">19-06</td> <td class="width-50 text-center">20:00</td> </tr> <tr class=""> <td class="width-50 text-center">10</td> <td>Silverstone Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Silverstone_Circuit" target="_blank">Silverstone, UK</a></td> <td class="width-60 text-center">03-07</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">11</td> <td>Red Bull Ring</td> <td><a href="http://en.wikipedia.org/wiki/Red_Bull_Ring" target="_blank">Spielberg, Austria</a></td> <td class="width-60 text-center">10-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">12</td> <td>Circuit Paul Ricard</td> <td><a href="http://en.wikipedia.org/wiki/Paul_Ricard_Circuit" target="_blank">Le Castellet, France</a></td> <td class="width-60 text-center">24-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">13</td> <td>Hungaroring</td> <td><a href="http://en.wikipedia.org/wiki/Hungaroring" target="_blank">Budapest, Hungary</a></td> <td class="width-60 text-center">31-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">14</td> <td>Circuit de Spa-Francorchamps</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_de_Spa-Francorchamps" target="_blank">Spa, Belgium</a></td> <td class="width-60 text-center">28-08</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">15</td> <td>Circuit Park Zandvoort</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_Zandvoort" target="_blank">Zandvoort, Netherlands</a></td> <td class="width-60 text-center">04-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">16</td> <td>Autodromo Nazionale di Monza</td> <td><a href="http://en.wikipedia.org/wiki/Autodromo_Nazionale_Monza" target="_blank">Monza, Italy</a></td> <td class="width-60 text-center">11-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">17</td> <td>Marina Bay Street Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit" target="_blank">Marina Bay, Singapore</a></td> <td class="width-60 text-center">02-10</td> <td class="width-50 text-center">14:00</td> </tr> <tr class=""> <td class="width-50 text-center">18</td> <td>Suzuka Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Suzuka_Circuit" target="_blank">Suzuka, Japan</a></td> <td class="width-60 text-center">09-10</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">19</td> <td>Circuit of the Americas</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_of_the_Americas" target="_blank">Austin, USA</a></td> <td class="width-60 text-center">23-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">20</td> <td>Autódromo Hermanos Rodríguez</td> <td><a href="http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez" target="_blank">Mexico City, Mexico</a></td> <td class="width-60 text-center">30-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">21</td> <td>Autódromo José Carlos Pace</td> <td><a href="http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace" target="_blank">São Paulo, Brazil</a></td> <td class="width-60 text-center">13-11</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">22</td> <td>Yas Marina Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Yas_Marina_Circuit" target="_blank">Abu Dhabi, UAE</a></td> <td class="width-60 text-center">20-11</td> <td class="width-50 text-center">14:00</td> </tr> </tbody> </table>');
    }),
    test.each`
    previous_race
    ${PreviousRaceDisplay.Hide}
    ${PreviousRaceDisplay.Strikethrough}
    ${PreviousRaceDisplay.Italic}
    `('Calling render with api returning data and previous race', async ({  previous_race }) => {          
        const card = new Schedule(parent);
        card.config.previous_race = previous_race;

        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 3, 1)); // Weird bug in jest setting this to the last of the month
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        
        jest.useRealTimers();
        expect(htmlResult).toMatch(`<table> <thead> <tr> <th>&nbsp;</th> <th>Race</th> <th>Location</th> <th class="text-center">Date</th> <th class="text-center">Time</th> </tr> </thead> <tbody> <tr class="${previous_race}"> <td class="width-50 text-center">1</td> <td>Bahrain International Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Bahrain_International_Circuit" target="_blank">Sakhir, Bahrain</a></td> <td class="width-60 text-center">20-03</td> <td class="width-50 text-center">16:00</td> </tr> <tr class="${previous_race}"> <td class="width-50 text-center">2</td> <td>Jeddah Corniche Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Jeddah_Street_Circuit" target="_blank">Jeddah, Saudi Arabia</a></td> <td class="width-60 text-center">27-03</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">3</td> <td>Albert Park Grand Prix Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit" target="_blank">Melbourne, Australia</a></td> <td class="width-60 text-center">10-04</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">4</td> <td>Autodromo Enzo e Dino Ferrari</td> <td><a href="http://en.wikipedia.org/wiki/Autodromo_Enzo_e_Dino_Ferrari" target="_blank">Imola, Italy</a></td> <td class="width-60 text-center">24-04</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">5</td> <td>Miami International Autodrome</td> <td><a href="http://en.wikipedia.org/wiki/Miami_International_Autodrome" target="_blank">Miami, USA</a></td> <td class="width-60 text-center">08-05</td> <td class="width-50 text-center">21:30</td> </tr> <tr class=""> <td class="width-50 text-center">6</td> <td>Circuit de Barcelona-Catalunya</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya" target="_blank">Montmeló, Spain</a></td> <td class="width-60 text-center">22-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">7</td> <td>Circuit de Monaco</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_de_Monaco" target="_blank">Monte-Carlo, Monaco</a></td> <td class="width-60 text-center">29-05</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">8</td> <td>Baku City Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Baku_City_Circuit" target="_blank">Baku, Azerbaijan</a></td> <td class="width-60 text-center">12-06</td> <td class="width-50 text-center">13:00</td> </tr> <tr class=""> <td class="width-50 text-center">9</td> <td>Circuit Gilles Villeneuve</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve" target="_blank">Montreal, Canada</a></td> <td class="width-60 text-center">19-06</td> <td class="width-50 text-center">20:00</td> </tr> <tr class=""> <td class="width-50 text-center">10</td> <td>Silverstone Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Silverstone_Circuit" target="_blank">Silverstone, UK</a></td> <td class="width-60 text-center">03-07</td> <td class="width-50 text-center">16:00</td> </tr> <tr class=""> <td class="width-50 text-center">11</td> <td>Red Bull Ring</td> <td><a href="http://en.wikipedia.org/wiki/Red_Bull_Ring" target="_blank">Spielberg, Austria</a></td> <td class="width-60 text-center">10-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">12</td> <td>Circuit Paul Ricard</td> <td><a href="http://en.wikipedia.org/wiki/Paul_Ricard_Circuit" target="_blank">Le Castellet, France</a></td> <td class="width-60 text-center">24-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">13</td> <td>Hungaroring</td> <td><a href="http://en.wikipedia.org/wiki/Hungaroring" target="_blank">Budapest, Hungary</a></td> <td class="width-60 text-center">31-07</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">14</td> <td>Circuit de Spa-Francorchamps</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_de_Spa-Francorchamps" target="_blank">Spa, Belgium</a></td> <td class="width-60 text-center">28-08</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">15</td> <td>Circuit Park Zandvoort</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_Zandvoort" target="_blank">Zandvoort, Netherlands</a></td> <td class="width-60 text-center">04-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">16</td> <td>Autodromo Nazionale di Monza</td> <td><a href="http://en.wikipedia.org/wiki/Autodromo_Nazionale_Monza" target="_blank">Monza, Italy</a></td> <td class="width-60 text-center">11-09</td> <td class="width-50 text-center">15:00</td> </tr> <tr class=""> <td class="width-50 text-center">17</td> <td>Marina Bay Street Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit" target="_blank">Marina Bay, Singapore</a></td> <td class="width-60 text-center">02-10</td> <td class="width-50 text-center">14:00</td> </tr> <tr class=""> <td class="width-50 text-center">18</td> <td>Suzuka Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Suzuka_Circuit" target="_blank">Suzuka, Japan</a></td> <td class="width-60 text-center">09-10</td> <td class="width-50 text-center">7:00</td> </tr> <tr class=""> <td class="width-50 text-center">19</td> <td>Circuit of the Americas</td> <td><a href="http://en.wikipedia.org/wiki/Circuit_of_the_Americas" target="_blank">Austin, USA</a></td> <td class="width-60 text-center">23-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">20</td> <td>Autódromo Hermanos Rodríguez</td> <td><a href="http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez" target="_blank">Mexico City, Mexico</a></td> <td class="width-60 text-center">30-10</td> <td class="width-50 text-center">21:00</td> </tr> <tr class=""> <td class="width-50 text-center">21</td> <td>Autódromo José Carlos Pace</td> <td><a href="http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace" target="_blank">São Paulo, Brazil</a></td> <td class="width-60 text-center">13-11</td> <td class="width-50 text-center">19:00</td> </tr> <tr class=""> <td class="width-50 text-center">22</td> <td>Yas Marina Circuit</td> <td><a href="http://en.wikipedia.org/wiki/Yas_Marina_Circuit" target="_blank">Abu Dhabi, UAE</a></td> <td class="width-60 text-center">20-11</td> <td class="width-50 text-center">14:00</td> </tr> </tbody> </table>`);
    }),
    test('Calling cardSize', () => { 
        const card = new Schedule(parent);
        expect(card.cardSize()).toBe(12);
    })
});