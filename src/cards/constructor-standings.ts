import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { ConstructorStanding, FormulaOneCardConfig } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class ConstructorStandings extends BaseCard {
    defaultTranslations = {
        'constructor' : 'Constructor',   
        'points' : 'Pts',
        'wins' : 'Wins'
    };

    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass, config);
    }    
    
    cardSize(): number {        
        const data = this.sensor.data as ConstructorStanding[];        
        if(!data) {
            return 2;
        }

        return (data.length == 0 ? 1 : data.length / 2 ) + 1;
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
                <th>${this.translation('constructor')}</th>
                <th class="width-60 text-center">${this.translation('points')}</th>
                <th class="text-center">${this.translation('wins')}</th>
            </tr>
            </thead>
            <tbody>
                ${data.map(standing => this.renderStandingRow(standing))}
            </tbody>
        </table>
      `;
    }
}
