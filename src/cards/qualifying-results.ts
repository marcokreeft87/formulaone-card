import { html, HTMLTemplateResult } from "lit";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { QualifyingResult, Race } from "../api/models";
import { getApiErrorMessage, getApiLoadingMessage, getCountryFlagByNationality, getDriverName, reduceArray, renderConstructorColumn, renderHeader } from "../utils";
import { BaseCard } from "./base-card";


export default class QualifyingResults extends BaseCard {
    defaultTranslations = {
        'driver' : 'Driver',   
        'team' : 'Team',
        'q1' : 'Q1',
        'q2' : 'Q2',
        'q3' : 'Q3',
        'raceheader' : 'Race',
        'seasonheader' : 'Season',
        'selectseason' : 'Select season',
        'selectrace' : 'Select race',
        'noresults' : 'Please select a race thats already been run.'
    };

    constructor(parent: FormulaOneCard) {
        super(parent);    
    } 

    cardSize(): number {
        return 11;
    }

    renderHeader(race?: Race): HTMLTemplateResult {
        
        if(race === null || race === undefined || parseInt(race.season) < 2018) {
            return null;
        }

        return renderHeader(this, race);
    }

    renderResultRow(result: QualifyingResult): HTMLTemplateResult {

        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(result.Driver.nationality)}">&nbsp;` : '')}${getDriverName(result.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`${renderConstructorColumn(this.config, result.Constructor)}` : '')}
                <td>${result.Q1}</td>
                <td>${result.Q2}</td>
                <td>${result.Q3}</td>
            </tr>`;
    }
    
    render(): HTMLTemplateResult {
        const { races, selectedRace, selectedSeason } = this.getProperties();

        if(selectedSeason === undefined) {
            this.client.GetLastResult().then(response => { 
                                
                this.client.GetQualifyingResults(parseInt(response.season), parseInt(response.round)).then(qualifyingResults => {
                    const { properties, cardValues } = this.getParentCardValues();
                    properties.selectedSeason = response.season;
                    properties.selectedRace = qualifyingResults.Races[0]; 
                    
                    this.client.GetSeasonRaces(parseInt(response.season)).then(racesResponse => {    
                        properties.races = racesResponse;
    
                        cardValues.set('cardValues', properties);   
                        this.parent.properties = cardValues;
                    }); 
                });                               
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedSeasonChanged = (ev: any): void => {
            const selectedSeason: number = ev.target.value;     
            const { properties, cardValues } = this.getParentCardValues();

            properties.selectedSeason = selectedSeason;
            this.client.GetSeasonRaces(selectedSeason).then(response => {    
                properties.selectedRace = undefined; 
                properties.races = response;
                properties.results = undefined;
                cardValues.set('cardValues', properties);
                this.parent.properties = cardValues;
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedRaceChanged = (ev: any): void => {
            const round = ev.target.value;
            const { properties, cardValues } = this.getParentCardValues();
    
            properties.selectedRound = round;
            this.client.GetQualifyingResults(properties.selectedSeason as number, round).then(response => {

                properties.selectedRace = response.Races[0];
                cardValues.set('cardValues', properties);
                this.parent.properties = cardValues;
            });
        }

        return html`   
            <table>
                <tr>
                    <td> 
                        ${this.translation('seasonheader')}<br />                      
                        ${until(
                            this.client.GetSeasons().then(response => { 
                                    const seasons = response?.reverse();
                                    return seasons
                                    ? html`<select name="selectedSeason" @change="${selectedSeasonChanged}">
                                            <option value="0">${this.translation('selectseason')}</option>
                                            ${seasons.map(season => {
                                                return html`<option value="${season.season}" ?selected=${selectedSeason === season.season}>${season.season}</option>`;
                                            })}
                                        </select>`
                                    : html`${getApiErrorMessage('seasons')}`;
                                }),
                            html`${getApiLoadingMessage()}`,
                          )}                 
                    </td>
                    <td>
                        ${this.translation('raceheader')}<br />
                        <select name="selectedRace" @change="${selectedRaceChanged}">
                            <option value="0" ?selected=${selectedRace === undefined}>${this.translation('selectrace')}</option>
                            ${races?.map(race => {
                                return html`<option value="${race.round}" ?selected=${selectedRace?.round == race.round}>${race.raceName}</option>`;
                            })}
                        </select>
                    </td>
                </tr></table>
                ${(selectedRace ?
                    html`<table>
                            <thead>                              
                                <tr>
                                    <td colspan="5">${this.renderHeader(selectedRace)}</td>
                                </tr>                  
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>${this.translation('driver')}</th>
                                    ${(this.config.standings?.show_team ? html`<th>${this.translation('team')}</th>` : '')}
                                    <th class="text-center">${this.translation('q1')}</th>
                                    <th class="text-center">${this.translation('q2')}</th>
                                    <th class="text-center">${this.translation('q3')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reduceArray(selectedRace.QualifyingResults, this.config.row_limit).map(result => this.renderResultRow(result))}
                            </tbody>
                        </table>` 
                : html`<table>
                            <tr>
                                <td>${this.translation('noresults')}</td>
                            </tr>
                        </table>`)}
        `;
    }    
}
