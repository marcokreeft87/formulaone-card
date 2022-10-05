import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { DriverStanding } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class DriverStandings extends BaseCard {

    constructor(sensor: string, hass: HomeAssistant) {
        super(sensor, hass);
    }    

    renderStandingRow(standing: DriverStanding): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${standing.position}</td>
                <td>${standing.Driver.code}</td>
                <td>${standing.Driver.givenName} ${standing.Driver.familyName}</td>
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
