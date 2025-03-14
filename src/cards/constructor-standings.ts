import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { ConstructorStanding } from "../api/f1-models";
import { getApiErrorMessage, getApiLoadingMessage, getEndOfSeasonMessage, getTeamImage, reduceArray } from "../utils";
import { BaseCard } from "./base-card";

export default class ConstructorStandings extends BaseCard {    
    defaultTranslations = {
        'constructor' : 'Constructor',   
        'points' : 'Pts',
        'wins' : 'Wins',
        'no_standings' : 'No standings available yet'
    };

    constructor(parent: FormulaOneCard) {
        super(parent);
    }    
    
    cardSize(): number {        
        return 11;
    }

    renderStandingRow(standing: ConstructorStanding): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${standing.position}</td>
                <td>${(this.config.standings?.show_teamlogo ? html`<img class="constructor-logo" height="20" width="20" src="${getTeamImage(this, standing.Constructor.constructorId)}">&nbsp;` : '')}${standing.Constructor.name}</td>
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetConstructorStandings().then(response =>
                response.length === 0 ? 
                html`${getEndOfSeasonMessage(this.translation('no_standings'))}` :                
                html`
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
                            ${reduceArray(response, this.config.row_limit).map(standing => this.renderStandingRow(standing))}
                        </tbody>
                    </table>
                    `)
                    .catch(() => html`${getApiErrorMessage('standings')}`),
            html`${getApiLoadingMessage()}`,
          )}`;
    }
}
