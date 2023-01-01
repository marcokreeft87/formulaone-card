import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import ErgastClient from "../api/ergast-client";
import { Race, Result, Season } from "../api/models";
import { FormulaOneCardConfig } from "../types/formulaone-card-types";
import { getCircuitName, getCountryFlagUrl, getDriverName } from "../utils";
import { BaseCard } from "./base-card";

export default class Results extends BaseCard {
    
    client: ErgastClient;
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'points' : 'Points',
        'status' : 'Status'
    };
    results: Result[];
    seasons: Season[];
    races: Race[];
    selectedRace: Race;

    constructor(hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(null, hass, config);

        this.client = new ErgastClient();
    }   

    async getSeasons() : Promise<Season[]> {
        return this.client.GetSeasons();
    } 

    async getSeasonRaces(season: number) : Promise<Race[]> {
        return this.client.GetSeasonRaces(season);
    }

    async getData() : Promise<Result[]> {
        return this.client.GetResults(2022, 22).then(value => value.Races[0].Results);
    }
    
    cardSize(): number {
        // const data = this.sensor.data as Race;
        // if(!data || !data.Results) {
        //     return 2;
        // }

        // return (data.Results.length == 0 ? 1 : data.Results.length / 2 ) + 1;
        return 2;
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
        
        const data = this.selectedRace;
        const countryDashed = data.Circuit.Location.country.replace(" ","-");
        const circuitName = getCircuitName(countryDashed);
        const imageHtml = html`<img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png">`;
        const imageWithLinkHtml = this.config.image_clickable ? html`<a target="_new" href="${data.Circuit.url}">${imageHtml}</a>` : imageHtml;

        return html`<h2><img height="25" src="${getCountryFlagUrl(data.Circuit.Location.country)}">&nbsp;  ${data.round} :  ${data.raceName}</h2>${imageWithLinkHtml}<br> `
    }

    render() : HTMLTemplateResult {

        //const data = this.client.GetResults(2022, 22);

        // const data = this.sensor.data as Race;
        // if(!this.sensor_entity_id.endsWith('_last_result') || data === undefined) {
        //     throw new Error('Please pass the correct sensor (last_result)')
        // }

        
        return html`   
            <table>
                <tr>
                    <td>
                        <select name="selectedSeason">
                            ${this.seasons.map(season => `<option value="${season.season}">${season.season}</option>`)}
                        </select>
                    </td>
                    <td>
                        <select name="selectedRace">
                            ${this.races.map(race => `<option value="${race.round}">${race.round} ${race.raceName}</option>`)}
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

    //     return html`       

    //         <table>
    //             <tr>
    //                 <td>${this.renderHeader()}</td>
    //             </tr>
    //         </table>
    //         <table>
    //             <thead>                    
    //                 <tr>
    //                     <th>&nbsp;</th>
    //                     <th>${this.translation('driver')}</th>
    //                     <th class="text-center">${this.translation('grid')}</th>
    //                     <th class="text-ccenter">${this.translation('points')}</th>
    //                     <th>${this.translation('status')}</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 ${data.Results.map(result => this.renderResultRow(result))}
    //             </tbody>
    //         </table>
    //   `;
    }
}
