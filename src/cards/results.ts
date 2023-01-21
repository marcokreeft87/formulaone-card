import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { Race, Result } from "../api/models";
import { CardProperties, FormulaOneCardConfig } from "../types/formulaone-card-types";
import { getApiErrorMessage, getApiLoadingMessage, getDriverName, renderHeader } from "../utils";
import { BaseCard } from "./base-card";

export default class Results extends BaseCard {    
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'points' : 'Points',
        'status' : 'Status',
        'raceheader' : 'Race',
        'seasonheader' : 'Season',
        'selectseason' : 'Select season',
        'selectrace' : 'Select race',
        'noresults' : 'Please select a race thats already been run.'
    };
    parent: FormulaOneCard;

    constructor(config: FormulaOneCardConfig, parent: FormulaOneCard) {
        super(config);

        this.parent = parent;
    }
    
    cardSize(): number {
        return 11;
    }

    renderResultRow(result: Result): HTMLTemplateResult {

        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${getDriverName(result.Driver, this.config)}</td>
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="width-50 text-center">${result.status}</td>
            </tr>`;
    }

    renderHeader(race?: Race): HTMLTemplateResult {
        
        if(race === null || race === undefined || parseInt(race.season) < 2018) {
            return null;
        }

        return renderHeader(this.config, race);
    }

    render() : HTMLTemplateResult {
        const { races, selectedRace, selectedSeason } = this.getProperties();

        if(selectedSeason === undefined) {
            this.client.GetLastResult().then(response => { 
                
                const { properties, cardValues } = this.getParentCardValues();
                properties.selectedSeason = response.season;
                properties.selectedRace = response;

                this.client.GetSeasonRaces(parseInt(response.season)).then(racesResponse => {    
                    properties.races = racesResponse;

                    cardValues.set('cardValues', properties);   
                    this.parent.properties = cardValues;
                });                
            })
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
            this.client.GetResults(properties.selectedSeason as number, round).then(response => {
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
                                    <th class="text-center">${this.translation('grid')}</th>
                                    <th class="text-ccenter">${this.translation('points')}</th>
                                    <th>${this.translation('status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${selectedRace.Results.map(result => this.renderResultRow(result))}
                            </tbody>
                        </table>` 
                : html`<table>
                            <tr>
                                <td>${this.translation('noresults')}</td>
                            </tr>
                        </table>`)}
        `;
    }

    private getProperties() {
        const cardProperties = this.parent.properties?.get('cardValues') as CardProperties;
        const races = cardProperties?.races as Race[];
        const selectedRace = cardProperties?.selectedRace as Race;
        const selectedSeason = cardProperties?.selectedSeason as string;
        return { races, selectedRace, selectedSeason };
    }

    private getParentCardValues() {
        const cardValues = this.parent.properties ?? new Map<string, unknown>();
        const properties = cardValues.get('cardValues') as CardProperties ?? {} as CardProperties;
        return { properties, cardValues };
    }
}
