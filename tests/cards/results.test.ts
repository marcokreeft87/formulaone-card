import { createMock } from "ts-auto-mock";
import FormulaOneCard from "../../src";
import ErgastClient from "../../src/api/ergast-client";
import { Mrdata, Race, Root } from "../../src/api/models";
import Results from "../../src/cards/results";
import { CardProperties, FormulaOneCardConfig } from "../../src/types/formulaone-card-types";
import { MRData as resultData } from '../testdata/results.json'
import { MRData as seasonData } from '../testdata/seasons.json'
import { MRData as raceData } from '../testdata/schedule.json'
import { getRenderString, getRenderStringAsync, getRenderStringAsyncIndex } from "../utils";
import { HTMLTemplateResult } from "lit";
import { config } from "webpack";

describe('Testing results file', () => {
    const parent = createMock<FormulaOneCard>({ 
        config: createMock<FormulaOneCardConfig>(),
    });
    const lastRace = <Race>resultData.RaceTable.Races[0];

    beforeAll(() => {
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementation((_endpoint) => {
            if(_endpoint === '2022/17/results.json`') {
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
                resolve({ MRData : <Mrdata>raceData });
            });
        });
    });    
    
    parent.properties = new Map<string, unknown>();

    test('Calling render without selecting season', async () => {   
        const card = new Results(parent);
                
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table>');
    }),
    test('Calling render with selected season', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979', races: raceData.RaceTable.Races, selectedRace: undefined });
        const card = new Results(parent);
                
        const result = card.render();
        const htmlResult = await getRenderStringAsyncIndex(result);    

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1950" ?selected=>1950</option><option value="1951" ?selected=>1951</option><option value="1952" ?selected=>1952</option><option value="1953" ?selected=>1953</option><option value="1954" ?selected=>1954</option><option value="1955" ?selected=>1955</option><option value="1956" ?selected=>1956</option><option value="1957" ?selected=>1957</option><option value="1958" ?selected=>1958</option><option value="1959" ?selected=>1959</option><option value="1960" ?selected=>1960</option><option value="1961" ?selected=>1961</option><option value="1962" ?selected=>1962</option><option value="1963" ?selected=>1963</option><option value="1964" ?selected=>1964</option><option value="1965" ?selected=>1965</option><option value="1966" ?selected=>1966</option><option value="1967" ?selected=>1967</option><option value="1968" ?selected=>1968</option><option value="1969" ?selected=>1969</option><option value="1970" ?selected=>1970</option><option value="1971" ?selected=>1971</option><option value="1972" ?selected=>1972</option><option value="1973" ?selected=>1973</option><option value="1974" ?selected=>1974</option><option value="1975" ?selected=>1975</option><option value="1976" ?selected=>1976</option><option value="1977" ?selected=>1977</option><option value="1978" ?selected=>1978</option><option value="1979" ?selected=>1979</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr></table> <table> <tr> <td>Please select a race thats already been run.</td> </tr> </table>');
    }),    
    test('Calling render with selected season and selected race', async () => {   
        
        const race = resultData.RaceTable.Races[0];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: raceData.RaceTable.Races, results: race.Results });
        const card = new Results(parent);
                
        const result = card.render();
        const htmlResult = await getRenderString(result);  

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr></table> <table> <thead> <tr> <td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td> </tr> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Sergio Pérez</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Charles Leclerc</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Carlos Sainz</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Lando Norris</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Daniel Ricciardo</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Lance Stroll</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Max Verstappen</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Sebastian Vettel</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Lewis Hamilton</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Pierre Gasly</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Valtteri Bottas</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Kevin Magnussen</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Mick Schumacher</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td>George Russell</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Yuki Tsunoda</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Esteban Ocon</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Alexander Albon</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Fernando Alonso</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Nicholas Latifi</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Guanyu Zhou</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> </table>');
    }),
    test('Calling render with selected season and selected race with standings', async () => {   
        
        const race = resultData.RaceTable.Races[0];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: raceData.RaceTable.Races, results: race.Results });

        if(parent?.config)
            parent.config.standings = { show_flag: true, show_team: true, show_teamlogo: true };
            
        const card = new Results(parent);
                
        const result = card.render();
        const htmlResult = await getRenderString(result);  

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr></table> <table> <thead> <tr> <td colspan="5"><h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td> </tr> <tr> <th>&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/mx.png">&nbsp;Sergio Pérez</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/mc.png">&nbsp;Charles Leclerc</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/es.png">&nbsp;Carlos Sainz</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/gb.png">&nbsp;Lando Norris</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/au.png">&nbsp;Daniel Ricciardo</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/ca.png">&nbsp;Lance Stroll</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/nl.png">&nbsp;Max Verstappen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/de.png">&nbsp;Sebastian Vettel</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/gb.png">&nbsp;Lewis Hamilton</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/fr.png">&nbsp;Pierre Gasly</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/fi.png">&nbsp;Valtteri Bottas</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/dk.png">&nbsp;Kevin Magnussen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/de.png">&nbsp;Mick Schumacher</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/gb.png">&nbsp;George Russell</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/jp.png">&nbsp;Yuki Tsunoda</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/fr.png">&nbsp;Esteban Ocon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/th.png">&nbsp;Alexander Albon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/es.png">&nbsp;Fernando Alonso</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/ca.png">&nbsp;Nicholas Latifi</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w40/cn.png">&nbsp;Guanyu Zhou</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> </table>');
    }),
    test('Calling selectedSeasonChanged should change parent properties', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979' });
        const card = new Results(parent);
                
        const result = card.render();

        const directive = result.values[1] as HTMLTemplateResult;
        const promise = directive.values[0] as Promise<unknown>;
        const promiseResult = await promise;

        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedSeasonChangedFn = (promiseResult as HTMLTemplateResult).values[0] as Function;
        selectedSeasonChangedFn({ target: { value: '2022' } });

        const properties = card.parent.properties.get('cardValues') as CardProperties;
        expect(properties).toMatchObject({ selectedSeason: '2022' } as CardProperties);
    }),
    test('Calling selectedRaceChanged should change parent properties', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979' });
        const card = new Results(parent);
                
        const result = card.render();

        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedRaceChangedFn = result.values[3] as Function;
        selectedRaceChangedFn({ target: { value: '17' } });

        const properties = card.parent.properties.get('cardValues') as CardProperties;
        expect(properties).toMatchObject({ selectedSeason: '1979', selectedRound: '17' } as CardProperties);
    }),
    test('Calling selectedRaceChanged should set parent properties', async () => {   
        
        const parentNew = createMock<FormulaOneCard>({ 
            config: createMock<FormulaOneCardConfig>(),
        });
        const card = new Results(parentNew);
                
        const result = card.render();

        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedRaceChangedFn = result.values[3] as Function;
        selectedRaceChangedFn({ target: { value: '17' } });
    }),
    test('Calling renderHeader with image not clickable', async () => { 
        const card = new Results(parent);
        card.config.image_clickable = undefined;
        
        const result = card.renderHeader(lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br>');
    }),
    test('Calling renderHeader with clickable image ', () => { 
        const card = new Results(parent);
        card.config.image_clickable = true;
        
        const result = card.renderHeader(lastRace);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toMatch('<h2 class=""><img height="25" src="https://flagcdn.com/w40/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class=" clickable" /><br>');
    }),
    test('Calling renderHeader with undefined race', async () => { 
        const card = new Results(parent);
        card.config.image_clickable = undefined;
        
        const result = card.renderHeader(undefined);
        const htmlResult = getRenderString(result);

        expect(htmlResult).toBe('');
    }),
    test('Calling cardSize with hass and sensor', () => { 
        const card = new Results(parent);
        expect(card.cardSize()).toBe(11);
    }),
    test('Calling render with api not returning data', async () => {   
        
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: undefined });
        const card = new Results(parent);

        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => {
                
            return new Promise<Root>((resolve) => {
                resolve(undefined as unknown as Root);
            });
        });
                
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting seasons <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr></table>');
    })
});