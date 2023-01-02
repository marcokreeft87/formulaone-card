import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { FormulaOneCardConfig, Race, Result } from "../types/formulaone-card-types";
import { getCircuitName, getCountryFlagByName, getDriverName } from "../utils";
import { BaseCard } from "./base-card";

export default class LastResult extends BaseCard {
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'points' : 'Points',
        'status' : 'Status'
    };

    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass, config);
    }   
    
    cardSize(): number {
        const data = this.sensor.data as Race;
        if(!data || !data.Results) {
            return 2;
        }

        return (data.Results.length == 0 ? 1 : data.Results.length / 2 ) + 1;
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

    renderHeader(): HTMLTemplateResult {
        
        const data = this.sensor.data as Race;
        const countryDashed = data.Circuit.Location.country.replace(" ","-");
        const circuitName = getCircuitName(countryDashed);
        const imageHtml = html`<img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png">`;
        const imageWithLinkHtml = this.config.image_clickable ? html`<a target="_new" href="${data.Circuit.url}">${imageHtml}</a>` : imageHtml;

        return html`<h2><img height="25" src="${getCountryFlagByName(data.Circuit.Location.country)}">&nbsp;  ${data.round} :  ${data.raceName}</h2>${imageWithLinkHtml}<br> `
    }

    render() : HTMLTemplateResult {

        const data = this.sensor.data as Race;
        if(!this.sensor_entity_id.endsWith('_last_result') || data === undefined) {
            throw new Error('Please pass the correct sensor (last_result)')
        }

        return html`       

            <table>
                <tr>
                    <td>${this.renderHeader()}</td>
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
                    ${data.Results.map(result => this.renderResultRow(result))}
                </tbody>
            </table>
      `;
    }
}
