// Mocks
import { createMock } from "ts-auto-mock";
import fetchMock from "jest-fetch-mock";

// Models
import FormulaOneCard from "../../src";
import { FastestLap, Mrdata, QualifyingResult, Race, Result } from "../../src/api/f1-models";
import Results from "../../src/cards/results";
import { CardProperties, FormulaOneCardConfig, FormulaOneCardTab, mwcTabBarEvent } from "../../src/types/formulaone-card-types";
import { getRenderString, getRenderStringAsync, getRenderStringAsyncIndex } from "../utils";
import { HTMLTemplateResult, html } from "lit";
import RestCountryClient from "../../src/api/restcountry-client";
import { Country } from "../../src/types/rest-country-types";
import ImageClient from "../../src/api/image-client";
import LocalStorageMock from "../testdata/localStorageMock";

// Importing test data
import { MRData as resultData } from '../testdata/results.json'
import { MRData as seasonData } from '../testdata/seasons.json'
import { MRData as scheduleData } from '../testdata/schedule.json'
import { MRData as qualifyingData } from '../testdata/qualifying.json'
import { MRData as sprintData } from '../testdata/sprint.json'
import * as countries from '../testdata/countries.json'

describe('Testing results file', () => {
    const parent = createMock<FormulaOneCard>({
        config: createMock<FormulaOneCardConfig>(),
    });
    const lastRace = <Race>resultData.RaceTable.Races[0];
    
    const localStorageMock = new LocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    beforeEach(() => {
        localStorageMock.clear();     
        fetchMock.resetMocks();
        jest.useFakeTimers();
        
        jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(() => null);
        jest.spyOn(ImageClient.prototype, 'GetImage').mockImplementation((url: string) => { return url; });  
    });

    beforeAll(() => {
        jest.spyOn(RestCountryClient.prototype, 'GetCountriesFromLocalStorage').mockImplementation(() => {
            return countries as Country[];
        });   
    });

    parent.properties = new Map<string, unknown>();

    test('Calling render without selecting season', async () => {
        // Arrange
        const card = new Results(parent);

        setFetchMock();

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr> </table>');
    }),
    test('Calling render with selected season', async () => {
        // Arrange
        parent.properties.set('cardValues', { selectedSeason: '1979', races: scheduleData.RaceTable.Races, selectedRace: undefined });
        const card = new Results(parent);
        
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsyncIndex(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change=""> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select> </td> <td> Race<br /> <select name="selectedRace" @change=""> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table>');
    }),
    test('Calling render with selected season and selected race', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, selectedTabIndex: 0 });
        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Sergio Pérez</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Charles Leclerc</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Carlos Sainz</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Lando Norris</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Daniel Ricciardo</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Lance Stroll</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Max Verstappen</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Sebastian Vettel</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Lewis Hamilton</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Pierre Gasly</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Valtteri Bottas</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Kevin Magnussen</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Mick Schumacher</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td>George Russell *</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Yuki Tsunoda</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Esteban Ocon</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Alexander Albon</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Fernando Alonso</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Nicholas Latifi</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Guanyu Zhou</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> <tfoot> <tr> <td colspan="6" class="text-right"><small>* Fastest lap: 1:46.458</small></td> </tr> </tfoot> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling render with selected season and selected race', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, results: race.Results, selectedTabIndex: 0 });
        const card = new Results(parent);
        // Act
        const result = card.render();

        // Assert
        // eslint-disable-next-line @typescript-eslint/ban-types
        const func = ((result.values[7] as HTMLTemplateResult).values[1] as HTMLTemplateResult).values[0] as Function;
        func({ detail: { index: 23 }  } as mwcTabBarEvent);

        const cardValues = card.parent.properties.get('cardValues') as CardProperties;

        expect(cardValues.selectedTabIndex).toBe(23);
    }),
    test('Calling render with selected season and selected race with standings', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, results: race.Results, selectedTabIndex: 0 });

        if(parent?.config)
            parent.config.standings = { show_flag: true, show_team: true, show_teamlogo: true };

        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mx.png">&nbsp;Sergio Pérez</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mc.png">&nbsp;Charles Leclerc</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Carlos Sainz</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lando Norris</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/au.png">&nbsp;Daniel Ricciardo</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Lance Stroll</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/nl.png">&nbsp;Max Verstappen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Sebastian Vettel</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lewis Hamilton</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Pierre Gasly</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fi.png">&nbsp;Valtteri Bottas</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/dk.png">&nbsp;Kevin Magnussen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Mick Schumacher</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;George Russell *</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/jp.png">&nbsp;Yuki Tsunoda</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Esteban Ocon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/th.png">&nbsp;Alexander Albon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Fernando Alonso</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Nicholas Latifi</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/cn.png">&nbsp;Guanyu Zhou</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> <tfoot> <tr> <td colspan="6" class="text-right"><small>* Fastest lap: 1:46.458</small></td> </tr> </tfoot> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling render with selected season and selected race with standings', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        race.QualifyingResults = qualifyingData.RaceTable.Races[0].QualifyingResults as QualifyingResult[];
        race.SprintResults = sprintData.RaceTable.Races[0].SprintResults as Result[];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, selectedTabIndex: 1 });

        if(parent?.config)
            parent.config.standings = undefined

        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:flag-checkered ><ha-icon slot="icon" icon="mdi:flag-checkered" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th class="text-center">Q1</th> <th class="text-center">Q2</th> <th class="text-center">Q3</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Max Verstappen</td> <td>1:19.222</td> <td>1:18.566</td> <td>1:17.775</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>George Russell</td> <td>1:19.583</td> <td>1:18.565</td> <td>1:18.079</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Lewis Hamilton</td> <td>1:19.169</td> <td>1:18.552</td> <td>1:18.084</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>Sergio Pérez</td> <td>1:19.706</td> <td>1:18.615</td> <td>1:18.128</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Carlos Sainz</td> <td>1:19.566</td> <td>1:18.560</td> <td>1:18.351</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Valtteri Bottas</td> <td>1:19.523</td> <td>1:18.762</td> <td>1:18.401</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Charles Leclerc</td> <td>1:19.505</td> <td>1:19.109</td> <td>1:18.555</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Lando Norris</td> <td>1:19.857</td> <td>1:19.119</td> <td>1:18.721</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>Fernando Alonso</td> <td>1:20.006</td> <td>1:19.272</td> <td>1:18.939</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Esteban Ocon</td> <td>1:19.945</td> <td>1:19.081</td> <td>1:19.010</td> </tr> <tr> <td class="width-50 text-center">11</td> <td>Daniel Ricciardo</td> <td>1:20.279</td> <td>1:19.325</td> <td></td> </tr> <tr> <td class="width-50 text-center">12</td> <td>Guanyu Zhou</td> <td>1:20.283</td> <td>1:19.476</td> <td></td> </tr> <tr> <td class="width-50 text-center">13</td> <td>Yuki Tsunoda</td> <td>1:19.907</td> <td>1:19.589</td> <td></td> </tr> <tr> <td class="width-50 text-center">14</td> <td>Pierre Gasly</td> <td>1:20.256</td> <td>1:19.672</td> <td></td> </tr> <tr> <td class="width-50 text-center">15</td> <td>Kevin Magnussen</td> <td>1:20.293</td> <td>1:19.833</td> <td></td> </tr> <tr> <td class="width-50 text-center">16</td> <td>Mick Schumacher</td> <td>1:20.419</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">17</td> <td>Sebastian Vettel</td> <td>1:20.419</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">18</td> <td>Lance Stroll</td> <td>1:20.520</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">19</td> <td>Alexander Albon</td> <td>1:20.859</td> <td></td> <td></td> </tr> <tr> <td class="width-50 text-center">20</td> <td>Nicholas Latifi</td> <td>1:21.167</td> <td></td> <td></td> </tr> </tbody> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling render with selected season and selected race with standings and qualifying results with sprint', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        race.QualifyingResults = qualifyingData.RaceTable.Races[0].QualifyingResults as QualifyingResult[];
        race.SprintResults = sprintData.RaceTable.Races[0].SprintResults as Result[];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, selectedTabIndex: 0 });

        if(parent?.config)
            parent.config.standings = { show_flag: true, show_team: true, show_teamlogo: true };

        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);

        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:flag-checkered ><ha-icon slot="icon" icon="mdi:flag-checkered" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mx.png">&nbsp;Sergio Pérez</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mc.png">&nbsp;Charles Leclerc</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Carlos Sainz</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lando Norris</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/au.png">&nbsp;Daniel Ricciardo</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Lance Stroll</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/nl.png">&nbsp;Max Verstappen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Sebastian Vettel</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lewis Hamilton</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Pierre Gasly</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fi.png">&nbsp;Valtteri Bottas</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/dk.png">&nbsp;Kevin Magnussen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Mick Schumacher</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;George Russell *</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/jp.png">&nbsp;Yuki Tsunoda</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Esteban Ocon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/th.png">&nbsp;Alexander Albon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Fernando Alonso</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Nicholas Latifi</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/cn.png">&nbsp;Guanyu Zhou</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> <tfoot> <tr> <td colspan="6" class="text-right"><small>* Fastest lap: 1:46.458</small></td> </tr> </tfoot> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling render with selected season and selected race with standings and qualifying results with sprint', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        race.QualifyingResults = qualifyingData.RaceTable.Races[0].QualifyingResults as QualifyingResult[];
        race.SprintResults = sprintData.RaceTable.Races[0].SprintResults as Result[];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, selectedTabIndex: 2 });

        if(parent?.config)
            parent.config.standings = { show_flag: true, show_team: true, show_teamlogo: true };

        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:flag-checkered ><ha-icon slot="icon" icon="mdi:flag-checkered" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th class="text-center">Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/nl.png">&nbsp;Max Verstappen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>1</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mc.png">&nbsp;Charles Leclerc</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>2</td> <td class="width-60 text-center">7</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mx.png">&nbsp;Sergio Pérez</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>7</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Carlos Sainz</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>10</td> <td class="width-60 text-center">5</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lando Norris</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>3</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/au.png">&nbsp;Daniel Ricciardo</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>6</td> <td class="width-60 text-center">3</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fi.png">&nbsp;Valtteri Bottas</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>8</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/dk.png">&nbsp;Kevin Magnussen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>4</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Fernando Alonso</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Mick Schumacher</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;George Russell</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>11</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/jp.png">&nbsp;Yuki Tsunoda</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>16</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Sebastian Vettel</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lewis Hamilton</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>13</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Lance Stroll</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Esteban Ocon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Pierre Gasly</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/th.png">&nbsp;Alexander Albon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>20</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Nicholas Latifi</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/cn.png">&nbsp;Guanyu Zhou</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Retired</td> </tr> </tbody> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling render with selected season and selected race with standings and qualifying results with sprint failing service', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        race.QualifyingResults = qualifyingData.RaceTable.Races[0].QualifyingResults as QualifyingResult[];
        race.SprintResults = sprintData.RaceTable.Races[0].SprintResults as Result[];
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, selectedTabIndex: 2 });

        if(parent?.config)
            parent.config.standings = { show_flag: true, show_team: true, show_teamlogo: true };

        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:flag-checkered ><ha-icon slot="icon" icon="mdi:flag-checkered" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th class="text-center">Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/nl.png">&nbsp;Max Verstappen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>1</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mc.png">&nbsp;Charles Leclerc</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>2</td> <td class="width-60 text-center">7</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mx.png">&nbsp;Sergio Pérez</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>7</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Carlos Sainz</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>10</td> <td class="width-60 text-center">5</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lando Norris</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>3</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/au.png">&nbsp;Daniel Ricciardo</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>6</td> <td class="width-60 text-center">3</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fi.png">&nbsp;Valtteri Bottas</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>8</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/dk.png">&nbsp;Kevin Magnussen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>4</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Fernando Alonso</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Mick Schumacher</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;George Russell</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>11</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/jp.png">&nbsp;Yuki Tsunoda</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>16</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Sebastian Vettel</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lewis Hamilton</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>13</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Lance Stroll</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Esteban Ocon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Pierre Gasly</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/th.png">&nbsp;Alexander Albon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>20</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Nicholas Latifi</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/cn.png">&nbsp;Guanyu Zhou</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Retired</td> </tr> </tbody> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling selectedSeasonChanged should change parent properties', async () => {
        // Arrange
        parent.properties.set('cardValues', { selectedSeason: '1979' });
        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const directive = result.values[1] as HTMLTemplateResult;

        const promise = directive.values[0] as Promise<unknown>;
        const promiseResult = await promise;

        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedSeasonChangedFn = (promiseResult as HTMLTemplateResult).values[0] as Function;
        selectedSeasonChangedFn({ target: { value: '2022' } });

        const properties = card.parent.properties.get('cardValues') as CardProperties;
        expect(properties).toMatchObject({ selectedSeason: '1979' } as CardProperties);
    }),
    test('Calling selectedRaceChanged should set parent properties', async () => {
        // Arrange
        const parentNew = createMock<FormulaOneCard>({
            config: createMock<FormulaOneCardConfig>(),
        });
        const card = new Results(parentNew);
        
        setFetchMock();

        // Act
        const result = card.render();

        // Assert
        // eslint-disable-next-line @typescript-eslint/ban-types
        const selectedRaceChangedFn = result.values[3] as Function;
        selectedRaceChangedFn({ target: { value: '17' } });
    }),
    test('Calling renderHeader with image not clickable', async () => {
        // Arrange
        const card = new Results(parent);
        card.config.image_clickable = undefined;

        // Act
        const result = card.renderHeader(lastRace);

        // Assert
        const htmlResult = getRenderString(result);
        expect(htmlResult).toMatch('<h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class="" /><br>');
    }),
    test('Calling renderHeader with clickable image ', () => {
        // Arrange
        const card = new Results(parent);
        card.config.image_clickable = true;

        // Act
        const result = card.renderHeader(lastRace);

        // Assert
        const htmlResult = getRenderString(result);
        expect(htmlResult).toMatch('<h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class=" clickable" /><br>');
    }),
    test('Calling renderHeader with undefined race', async () => {
        // Arrange
        const card = new Results(parent);
        card.config.image_clickable = undefined;

        // Act
        const result = card.renderHeader(undefined);
        
        // Assert
        const htmlResult = getRenderString(result);
        expect(htmlResult).toBe('');
    }),
    test('Calling cardSize with hass and sensor', () => {
        const card = new Results(parent);
        expect(card.cardSize()).toBe(12);
    }),
    test('Calling icon', () => {        
        const card = new Results(parent);
        card.config.icons = {
            'sprint': 'mdi:car-sports',
        }

        expect(card.icon('sprint')).toBe('mdi:car-sports');
        expect(card.icon('qualifying')).toBe('mdi:timer-outline');
    }),
    test('Calling render with api not returning data', async () => {
        // Arrange
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: undefined });
        const card = new Results(parent);

        fetchMock.mockRejectOnce(new Error('Error getting data'));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting seasons <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr> </table>');
    }),    
    test('Calling render with selectedSeason undefined', async () => {
        // Arrange
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 27, 15, 10, 0)); // Weird bug in jest setting this to the last of the month

        parent.properties.set('cardValues', { selectedSeason: undefined, selectedRace: undefined });
        const card = new Results(parent);

        setFetchMock();

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr> </table>');
    }),
    test('Calling render with selectedSeason undefined and sprint in past', async () => {
        // Arrange
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 3, 24, 10)); // Weird bug in jest setting this to the last of the month

        parent.properties.set('cardValues', { selectedSeason: undefined, selectedRace: undefined });
        const card = new Results(parent);

        setFetchMock();

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr> </table>');
    }),
    test('Calling render with selectedSeason undefined and no sprintdata', async () => {
        // Arrange
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2022, 2, 27, 15, 10, 0)); // Weird bug in jest setting this to the last of the month

        parent.properties.set('cardValues', { selectedSeason: undefined, selectedRace: undefined });
        const card = new Results(parent);

        const sprintDataCopy = sprintData;
        sprintDataCopy.RaceTable.Races = [];
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>qualifyingData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>sprintDataCopy }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr> </table>');
    }),
    test('Calling render with selectedSeason undefined no results', async () => {
        // Arrange
        jest.setSystemTime(new Date(2022, 2, 27, 15, 10, 0)); // Weird bug in jest setting this to the last of the month

        parent.properties.set('cardValues', { selectedSeason: undefined, selectedRace: undefined });
        const card = new Results(parent);

        setFetchMock();

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderStringAsync(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> <select name="selectedSeason" @change="selectedSeasonChanged"> <option value="0">Select season</option> <option value="1979" ?selected=>1979</option><option value="1978" ?selected=>1978</option><option value="1977" ?selected=>1977</option><option value="1976" ?selected=>1976</option><option value="1975" ?selected=>1975</option><option value="1974" ?selected=>1974</option><option value="1973" ?selected=>1973</option><option value="1972" ?selected=>1972</option><option value="1971" ?selected=>1971</option><option value="1970" ?selected=>1970</option><option value="1969" ?selected=>1969</option><option value="1968" ?selected=>1968</option><option value="1967" ?selected=>1967</option><option value="1966" ?selected=>1966</option><option value="1965" ?selected=>1965</option><option value="1964" ?selected=>1964</option><option value="1963" ?selected=>1963</option><option value="1962" ?selected=>1962</option><option value="1961" ?selected=>1961</option><option value="1960" ?selected=>1960</option><option value="1959" ?selected=>1959</option><option value="1958" ?selected=>1958</option><option value="1957" ?selected=>1957</option><option value="1956" ?selected=>1956</option><option value="1955" ?selected=>1955</option><option value="1954" ?selected=>1954</option><option value="1953" ?selected=>1953</option><option value="1952" ?selected=>1952</option><option value="1951" ?selected=>1951</option><option value="1950" ?selected=>1950</option> </select><table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> </select> </td> </tr> </table>');
    }),
    test('Calling setSelectedRace with selectedSeason undefined no results', async () => {
        // Arrange
        parent.properties.set('cardValues', { selectedSeason: '2022', selectedRace: undefined });
        const card = new Results(parent);

        setFetchMock();

        // Act
        card.setSelectedRace({ target: { value: '6' } });

        // Assert
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/6/results.json", {"headers": {"Accept": "application/json"}});
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/6/qualifying.json", {"headers": {"Accept": "application/json"}});
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/6/sprint.json", {"headers": {"Accept": "application/json"}});
    }),   
    test('Calling setSelectedRace with selectedSeason undefined no results', async () => {
        // Arrange
        parent.properties.set('cardValues', { selectedSeason: '2022', selectedRace: undefined });
        const card = new Results(parent);

        setFetchMock();

        // Act
        card.setSelectedRace({ target: { value: '5' } });

        // Assert
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/5/results.json", {"headers": {"Accept": "application/json"}});
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/5/qualifying.json", {"headers": {"Accept": "application/json"}});
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/5/sprint.json", {"headers": {"Accept": "application/json"}});
    }),    
    test('Calling setSelectedRace with selectedSeason undefined no results', async () => {
        // Arrange
        parent.properties.set('cardValues', { selectedSeason: '2022', selectedRace: undefined });
        const card = new Results(parent);

        setFetchMock();

        // Act
        card.setSelectedRace({ target: { value: '5' } });

        // Assert
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/5/results.json", {"headers": {"Accept": "application/json"}});
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/5/qualifying.json", {"headers": {"Accept": "application/json"}});
        expect(fetchMock).toHaveBeenCalledWith("https://ergast.com/api/f1/2022/5/sprint.json", {"headers": {"Accept": "application/json"}});
    }),
    test('Calling render without tab_order should arrange tabs in default order', async () => {
        // Arrange
        const card = new Results(parent);

        // Act
        const tabs = card.renderTabs(lastRace);

        // Assert
        expect(tabs[0].title).toBe('Results');
        expect(tabs[1].title).toBe('Qualifying');
        expect(tabs[2].title).toBe('Sprint');
    }),
    test('Calling render with selected season and selected race without fastest lap', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0];
        race.Results.forEach(result => {
            result.FastestLap = undefined as unknown as FastestLap;
        });
        race.round = "1";
        parent.properties.set('cardValues', { selectedSeason: '1979', selectedRace: race, races: scheduleData.RaceTable.Races, selectedTabIndex: 0 });
        const card = new Results(parent);

        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));

        // Act
        const result = card.render();

        // Assert
        const htmlResult = await getRenderString(result);
        expect(htmlResult).toMatch('<table> <tr> <td> Season<br /> </td> <td> Race<br /> <select name="selectedRace" @change="selectedRaceChanged"> <option value="0" ?selected=>Select race</option> <option value="1" ?selected=>Bahrain Grand Prix</option><option value="2" ?selected=>Saudi Arabian Grand Prix</option><option value="3" ?selected=>Australian Grand Prix</option><option value="4" ?selected=>Emilia Romagna Grand Prix</option><option value="5" ?selected=>Miami Grand Prix</option><option value="6" ?selected=>Spanish Grand Prix</option><option value="7" ?selected=>Monaco Grand Prix</option><option value="8" ?selected=>Azerbaijan Grand Prix</option><option value="9" ?selected=>Canadian Grand Prix</option><option value="10" ?selected=>British Grand Prix</option><option value="11" ?selected=>Austrian Grand Prix</option><option value="12" ?selected=>French Grand Prix</option><option value="13" ?selected=>Hungarian Grand Prix</option><option value="14" ?selected=>Belgian Grand Prix</option><option value="15" ?selected=>Dutch Grand Prix</option><option value="16" ?selected=>Italian Grand Prix</option><option value="17" ?selected=>Singapore Grand Prix</option><option value="18" ?selected=>Japanese Grand Prix</option><option value="19" ?selected=>United States Grand Prix</option><option value="20" ?selected=>Mexico City Grand Prix</option><option value="21" ?selected=>Brazilian Grand Prix</option><option value="22" ?selected=>Abu Dhabi Grand Prix</option> </select> </td> </tr> </table> <table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class=" clickable" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=mdi:trophy ><ha-icon slot="icon" icon="mdi:trophy" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:timer-outline ><ha-icon slot="icon" icon="mdi:timer-outline" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=mdi:car-sports ><ha-icon slot="icon" icon="mdi:car-sports" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> <table class="nopadding"> <thead> <tr> <th>&nbsp;</th> <th>Driver</th> <th>Team</th> <th class="text-center">Grid</th> <th class="text-center">Points</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mx.png">&nbsp;Sergio Pérez</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>2</td> <td class="width-60 text-center">25</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/mc.png">&nbsp;Charles Leclerc</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>1</td> <td class="width-60 text-center">18</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Carlos Sainz</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td>4</td> <td class="width-60 text-center">15</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lando Norris</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>6</td> <td class="width-60 text-center">12</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/au.png">&nbsp;Daniel Ricciardo</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td>16</td> <td class="width-60 text-center">10</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Lance Stroll</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>11</td> <td class="width-60 text-center">8</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/nl.png">&nbsp;Max Verstappen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td>8</td> <td class="width-60 text-center">6</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Sebastian Vettel</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td>13</td> <td class="width-60 text-center">4</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;Lewis Hamilton</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>3</td> <td class="width-60 text-center">2</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Pierre Gasly</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>7</td> <td class="width-60 text-center">1</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">11</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fi.png">&nbsp;Valtteri Bottas</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>15</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">12</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/dk.png">&nbsp;Kevin Magnussen</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>9</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Finished</td> </tr> <tr> <td class="width-50 text-center">13</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/de.png">&nbsp;Mick Schumacher</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td>12</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+1 Lap</td> </tr> <tr> <td class="width-50 text-center">14</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/gb.png">&nbsp;George Russell</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td>0</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">+2 Laps</td> </tr> <tr> <td class="width-50 text-center">15</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/jp.png">&nbsp;Yuki Tsunoda</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td>10</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Accident</td> </tr> <tr> <td class="width-50 text-center">16</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/fr.png">&nbsp;Esteban Ocon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>17</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">17</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/th.png">&nbsp;Alexander Albon</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>18</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">18</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/es.png">&nbsp;Fernando Alonso</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td>5</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Engine</td> </tr> <tr> <td class="width-50 text-center">19</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/ca.png">&nbsp;Nicholas Latifi</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td>19</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision damage</td> </tr> <tr> <td class="width-50 text-center">20</td> <td><img height="10" width="20" src="https://flagcdn.com/w320/cn.png">&nbsp;Guanyu Zhou</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td>14</td> <td class="width-60 text-center">0</td> <td class="width-50 text-center">Collision</td> </tr> </tbody> </table> </article> </section> </td> </tr> </table>');
    }),
    test('Calling render without tab_order should arrange tabs in given order', async () => {
        // Arrange
        const card = new Results(parent);
        card.config.tabs_order = ['Qualifying', 'Sprint', 'Results'];

        // Act
        const tabs = card.renderTabs(lastRace);

        // Assert
        expect(tabs[0].title).toBe('Qualifying');
        expect(tabs[1].title).toBe('Sprint');
        expect(tabs[2].title).toBe('Results');
    }),    
    test('Calling renderTabsHtml with race, tabs and selected index should return expected html', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        
        const card = new Results(parent);
        const tabs: FormulaOneCardTab[] = [
            { title: 'Qualifying', content: html`Qualifying`, icon: 'speed' },
            { title: 'Sprint', content: html`Sprint`, icon: 'speed' },
            { title: 'Results', content: html`Results`, icon: 'speed' }
        ];

        // Act
        const result = card.renderTabsHtml(tabs, 1, race);        
        const htmlResult = await getRenderString(result);

        // Assert
        expect(htmlResult).toBe('<table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class=" clickable" /><br></td></tr> <tr class="transparent"> <td colspan="2"> <mwc-tab-bar @MDCTabBar:activated= > <mwc-tab ?hasImageIcon=speed ><ha-icon slot="icon" icon="speed" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=speed ><ha-icon slot="icon" icon="speed" ></ha-icon> </mwc-tab> <mwc-tab ?hasImageIcon=speed ><ha-icon slot="icon" icon="speed" ></ha-icon> </mwc-tab> </mwc-tab-bar> <section> <article> Sprint </article> </section> </td> </tr> </table>');
    }),  
    test('Calling renderTabsHtml with race, tabs and selected index should return expected html', async () => {
        // Arrange
        const race = resultData.RaceTable.Races[0] as Race;
        
        const card = new Results(parent);
        const tabs: FormulaOneCardTab[] = [
            { title: 'Qualifying', content: null as unknown as HTMLTemplateResult, icon: 'speed' },
            { title: 'Sprint', content: null as unknown as HTMLTemplateResult, icon: 'speed' },
            { title: 'Results', content: null as unknown as HTMLTemplateResult, icon: 'speed' }
        ];

        // Act
        const result = card.renderTabsHtml(tabs, 1, race);        
        const htmlResult = await getRenderString(result);
        
        // Assert
        expect(htmlResult).toBe('<table> <tr><td colspan="2"><h2 class=""><img height="25" src="https://flagcdn.com/w320/sg.png">&nbsp; 1 : Singapore Grand Prix</h2> <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/7col/image.png" @action=_handleAction .actionHandler= class=" clickable" /><br></td></tr> <tr><td colspan="2">Please select a race thats already been run.</td></tr> </table>');
    }),
    test('Calling renderTabsHtml with race undefined, tabs and selected index should return expected html', async () => {
        // Arrange        
        const card = new Results(parent);
        const tabs: FormulaOneCardTab[] = [
            { title: 'Qualifying', content: html`Qualifying`, icon: 'speed' },
            { title: 'Sprint', content: html`Sprint`, icon: 'speed' },
            { title: 'Results', content: html`Results`, icon: 'speed' }
        ];

        // Act
        const result = card.renderTabsHtml(tabs, 1, undefined);        
        const htmlResult = await getRenderString(result);

        // Assert
        expect(htmlResult).toBe('');
    })

    function setFetchMock() {
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>seasonData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>qualifyingData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>sprintData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>scheduleData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
        fetchMock.mockResponseOnce(JSON.stringify({ MRData : <Mrdata>resultData }));
    }
});