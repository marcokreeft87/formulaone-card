import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import { DriverStanding } from "../api/models";
import { FormulaOneCardConfig } from "../types/formulaone-card-types";
import { getCountryFlagByNationality, getDriverName } from "../utils";
import { BaseCard } from "./base-card";

export default class DriverStandings extends BaseCard {
    defaultTranslations = {
        'driver' : 'Driver',   
        'team' : 'Team',
        'points' : 'Pts',
        'wins' : 'Wins'
    };

    constructor(hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(hass, config);
    }    
    
    cardSize(): number {
        return 2;
        // const data = this.sensor.data as DriverStanding[];
        // if(!data) {
        //     return 2;
        // }

        //return (data.length == 0 ? 1 : data.length / 2 ) + 1;
    }  
    
    renderStandingRow(standing: DriverStanding): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-40 text-center">${standing.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(standing.Driver.nationality)}">&nbsp;` : '')}${standing.Driver.code}</td>
                <td>${getDriverName(standing.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`<td>${standing.Constructors[0].name}</td>` : '')}
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetDriverStandings().then(response => response
              ? html`
                    <table>
                        <thead>
                        <tr>
                            <th class="width-50" colspan="2">&nbsp;</th>
                            <th>${this.translation('driver')}</th>                
                            ${(this.config.standings?.show_team ? html`<th>${this.translation('team')}</th>` : '')}
                            <th class="width-60 text-center">${this.translation('points')}</th>
                            <th class="text-center">${this.translation('wins')}</th>
                        </tr>
                        </thead>
                        <tbody>
                            ${response.map(standing => this.renderStandingRow(standing))}
                        </tbody>
                    </table>
                    `
              : html`Error getting standings`),
            html`Loading...`,
          )}`;
    }
}
