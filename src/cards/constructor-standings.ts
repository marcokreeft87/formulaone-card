import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { ConstructorStanding, FormulaOneCardConfig } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class ConstructorStandings extends BaseCard {

    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass, config);
    }    
    
    cardSize(): number {
        throw new Error("Method not implemented.");
    }

    renderStandingRow(standing: ConstructorStanding): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${standing.position}</td>
                <td>${standing.Constructor.name}</td>
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        const data = this.sensor.data as ConstructorStanding[];
        if(!this.sensor_entity_id.endsWith('_constructors') || data === undefined) {
            throw new Error('Please pass the correct sensor (constructors)')
        }

        return html`
        <table>
            <thead>
            <tr>
                <th class="width-50">&nbsp;</th>
                <th>Constructor</th>
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
