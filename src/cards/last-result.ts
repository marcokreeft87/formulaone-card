import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import { Race, Result } from "../api/models";
import { FormulaOneCardConfig } from "../types/formulaone-card-types";
import { getApiErrorMessage, getApiLoadingMessage, getCircuitName, getCountryFlagByName, getDriverName } from "../utils";
import { BaseCard } from "./base-card";

export default class LastResult extends BaseCard {
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'points' : 'Points',
        'status' : 'Status'
    };

    constructor(config: FormulaOneCardConfig) {
        super(config);
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

    renderHeader(data: Race): HTMLTemplateResult {        
        const countryDashed = data.Circuit.Location.country.replace(" ","-");
        const circuitName = getCircuitName(countryDashed);
        const imageHtml = html`<img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png">`;
        const imageWithLinkHtml = this.config.image_clickable ? html`<a target="_new" href="${data.Circuit.url}">${imageHtml}</a>` : imageHtml;

        return html`<h2><img height="25" src="${getCountryFlagByName(data.Circuit.Location.country)}">&nbsp;  ${data.round} :  ${data.raceName}</h2>${imageWithLinkHtml}<br> `
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetLastResult().then(response => response
              ? html` 
                    <table>
                        <tr>
                            <td>${this.renderHeader(response)}</td>
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
                            ${response.Results.map(result => this.renderResultRow(result))}
                        </tbody>
                    </table>`
              : html`${getApiErrorMessage('last result')}`),
            html`${getApiLoadingMessage()}`,
          )}`;
    }
}
