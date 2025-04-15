import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { DriverStanding } from "../api/f1-models";
import { getApiErrorMessage, getApiLoadingMessage, getCountryFlagByNationality, getDriverName, getEndOfSeasonMessage, reduceArray, renderConstructorColumn } from "../utils";
import { BaseCard } from "./base-card";

export default class DriverStandings extends BaseCard {
    defaultTranslations = {
        'driver' : 'Driver',   
        'team' : 'Team',
        'points' : 'Pts',
        'wins' : 'Wins',
        'no_standings' : 'No standings available yet'
    };

    constructor(parent: FormulaOneCard) {
        super(parent);    
    }
    
    cardSize(): number {
        return 12;
    }  
    
    renderStandingRow(standing: DriverStanding): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-40 text-center">${standing.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(this, standing.Driver.nationality)}">&nbsp;` : '')}${standing.Driver.code}</td>
                <td>${getDriverName(standing.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`${renderConstructorColumn(this, standing.Constructors[standing.Constructors.length - 1])}` : '')}
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetDriverStandings().then(response =>
                response.length === 0 ? 
                html`${getEndOfSeasonMessage(this.translation('no_standings'))}` : 
              html`
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
                            ${reduceArray(response, this.config.row_limit).map(standing => this.renderStandingRow(standing))}
                        </tbody>
                    </table>
                    `
                )
              .catch(() => html`${getApiErrorMessage('standings')}`),
            html`${getApiLoadingMessage()}`,
          )}`;
    }
}
