import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { Race, Result } from "../api/models";
import { CardProperties, FormulaOneCardConfig } from "../types/formulaone-card-types";
import { getApiErrorMessage, getApiLoadingMessage, getCircuitName, getCountryFlagUrl, getDriverName } from "../utils";
import { BaseCard } from "./base-card";

export default class Results extends BaseCard {    
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'points' : 'Points',
        'status' : 'Status',
        'raceheader' : 'Race',
        'seasonheader' : 'Season',
    };
    results: Result[] = [];
    races: Race[];
    selectedRace: Race;
    selectedRound: number;
    selectedSeason: number;
    parent: FormulaOneCard;

    constructor(config: FormulaOneCardConfig, parent: FormulaOneCard) {
        super(config);

        this.parent = parent;
    }

    async getSeasonRaces(season: number) : Promise<Race[]> {
        return this.client.GetSeasonRaces(season);
    }

    async getData() : Promise<Result[]> {
        return this.client.GetResults(2022, 22).then(value => value.Races[0].Results);
    }

    async setValues(values: Map<string, unknown>) {
        const properties = await this.extractProperties(values);      
        
        this.races = properties.races as Race[];
    }

    private extractProperties(values: Map<string, unknown>) {
        return new Promise<CardProperties>((resolve) => {
            const cardProperties = values.get('cardValues') as CardProperties;
            if(cardProperties) {
                resolve(cardProperties);
            }
        });
    }
    
    cardSize(): number {
        // const data = this.sensor.data as Race;
        // if(!data || !data.Results) {
        //     return 2;
        // }

        // return (data.Results.length == 0 ? 1 : data.Results.length / 2 ) + 1;
        return 12;
    }

    renderResultRow(result: Result): HTMLTemplateResult {

        return html`
            <tr>
                <td class="width-50 text-center">${result}</td>
                <td>${getDriverName(result.Driver, this.config)}</td>
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="width-50 text-center">${result.status}</td>
            </tr>`;
    }

    renderHeader(): HTMLTemplateResult {
        
        if(!this.selectedRace) {
            return null;
        }

        const data = this.selectedRace;
        const countryDashed = data.Circuit.Location.country.replace(" ","-");
        const circuitName = getCircuitName(countryDashed);
        const imageHtml = html`<img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png">`;
        const imageWithLinkHtml = this.config.image_clickable ? html`<a target="_new" href="${data.Circuit.url}">${imageHtml}</a>` : imageHtml;

        return html`<h2><img height="25" src="${getCountryFlagUrl(data.Circuit.Location.country)}">&nbsp;  ${data.round} :  ${data.raceName}</h2>${imageWithLinkHtml}<br> `
    }

    render() : HTMLTemplateResult {

        console.log('child render Races', this.races);
        
        const selectedSeasonChanged = (ev: any): void => {
            const selectedSeason: number = ev.target.value;        
            console.log('Season', selectedSeason);

            this.selectedSeason = selectedSeason;
            this.client.GetSeasonRaces(selectedSeason).then(response => { 
                this.races = response;

                const cardValues = this.parent.cardValues ?? new Map<string, unknown>();
                //const properties = cardValues.get('cardValues') as CardProperties;

                // get const from cardValues as CardProperties and create new instance of CardProperties if not exists
                const properties = cardValues.get('cardValues') as CardProperties ?? {} as CardProperties;

                properties.races = this.races;

                cardValues.set('cardValues', properties);
                // const temp = new Map<string, unknown>();//this.parent.cardValues ?? new Map<string, unknown>();
                // temp.set('cardValues', { "races" : this.races });

                this.parent.cardValues = cardValues;
            });
        }

        const selectedRaceChanged = (ev: any): void => {
            const round = ev.target.value;
            console.log('child selectedRaceChanged', round);
    
            this.client.GetResults(this.selectedSeason, round).then(response => { 
                this.results = response.Races[0].Results;

                // const temp = this.parent.cardValues ?? new Map<string, unknown>();
                // temp.set('cardValues', this.results);

                // this.parent.cardValues = temp;
            });
        }
        
        return html`   
            <table>
                <tr>
                    <td> 
                        ${this.translation('seasonheader')}&nbsp;                       
                        ${until(
                            this.client.GetSeasons().then(response => { 
                                    const seasons = response?.reverse();
                                    return seasons
                                    ? html`<select name="selectedSeason" @change="${selectedSeasonChanged}">
                                            ${seasons.map(season => {
                                                return html`<option value="${season.season}">${season.season}</option>`;
                                            })}
                                        </select>`
                                    : html`${getApiErrorMessage('seasons')}`;
                                }),
                            html`${getApiLoadingMessage()}`,
                          )}                 
                    </td>
                    <td>
                        ${this.translation('raceheader')}&nbsp;
                        <select name="selectedRace" @change="${selectedRaceChanged}">
                            ${this.races?.map(race => {
                                return html`<option value="${race.round}">${race.raceName}</option>`;
                            })}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">${this.renderHeader()}</td>
                </tr>
            </table>
            <table>
                <thead>                    
                    <tr>
                        <th>&nbsp;</th>
                        <th>${this.translation('driver')}</th>
                        <th class="text-center">${this.translation('grid')}</th>
                        <th class="text-ccenter">${this.translation('points')}</th>
                        <th>${this.translation('status')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.results.map(result => this.renderResultRow(result))}
                </tbody>
            </table>
        `;
    }
}
