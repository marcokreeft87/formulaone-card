import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { Race, Result } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class LastResult extends BaseCard {

    date_locale?: string;

    constructor(sensor: string, hass: HomeAssistant) {
        super(sensor, hass);
    } 

    renderResultRow(result: Result): HTMLTemplateResult {

        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${result.Driver.givenName} ${result.Driver.familyName}</td>
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="text-center">${result.status}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        const data = this.sensor.data as Race;
        if(!this.sensor_entity_id.endsWith('_last_result') || data === undefined) {
            throw new Error('Please pass the correct sensor (last_result)')
        }

        const countryDashed = data.Circuit.Location.country.replace(" ","-");

        return html`       

            <table>
                <tr>
                    <td>
                        <h2><img height="25" src="https://www.countries-ofthe-world.com/flags-normal/flag-of-${countryDashed}.png">&nbsp;  ${data.round} :  ${data.raceName}</h2>
                        <a target="_new" href="${data.Circuit.url}">
                            <img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${countryDashed}_Circuit.png.transform/7col/image.png">
                        </a> <br> 
                    </td>
                </tr>
            </table>
            <table>
                <thead>                    
                    <tr>
                        <th>&nbsp;</th>
                        <th>Driver</th>
                        <th class="text-center">Grid</th>
                        <th class="text-ccenter">Points</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.Results.map(result => this.renderResultRow(result))}
                </tbody>
            </table>
      `;
    }
}
