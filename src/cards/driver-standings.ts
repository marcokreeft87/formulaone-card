import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { DriverStanding, FormulaOneCardConfig } from "../types/formulaone-card-types";
import { getCountryFlagUrl, getDriverName } from "../utils";
import { BaseCard } from "./base-card";
import * as countries from '../data/countries.json';

export default class DriverStandings extends BaseCard {

    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass, config);
    }    

    getCountryFlag = (nationality: string) => {
        const country = countries.filter(x => x.Nationality === nationality)[0].Country;
        const countryDashed = country.replace(" ","-");

        return getCountryFlagUrl(countryDashed);
    }
    
    renderStandingRow(standing: DriverStanding): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-40 text-center">${standing.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" src="${this.getCountryFlag(standing.Driver.nationality)}">&nbsp;` : '')}${standing.Driver.code}</td>
                <td>${getDriverName(standing.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`<td>${standing.Constructors[0].name}</td>` : '')}
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        const data = this.sensor.data as DriverStanding[];
        if(!this.sensor_entity_id.endsWith('_drivers') || data === undefined) {
            throw new Error('Please pass the correct sensor (drivers)')
        }

        return html`
        <table>
            <thead>
            <tr>
                <th class="width-50" colspan="2">&nbsp;</th>
                <th>Driver</th>                
                ${(this.config.standings?.show_team ? html`<th>Team</th>` : '')}
                <th class="width-60 text-center">Pts</th>
                <th class="text-center">Wins</th>
            </tr>
            </thead>
            <tbody>
                ${data.map(standing => this.renderStandingRow(standing))}
            </tbody>
        </table>
      `;
    }
}
