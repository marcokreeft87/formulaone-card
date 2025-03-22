import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { Result } from "../api/f1-models";
import { getApiErrorMessage, getApiLoadingMessage, getDriverName, reduceArray, renderHeader, translateStatus } from "../utils";
import { BaseCard } from "./base-card";

export default class LastResult extends BaseCard {
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'points' : 'Points',
        'status' : 'Status'
    };

    constructor(parent: FormulaOneCard) {
        super(parent);    
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
                <td class="width-50 text-center">${translateStatus(result.status, this.config)}</td>
            </tr>`;
    }   

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetLastResult().then(response => 
                html` 
                    <table>
                        <tr>
                            <td>${renderHeader(this, response)}</td>
                        </tr>
                    </table>
                    <table>
                        <thead>                    
                            <tr>
                                <th>&nbsp;</th>
                                <th>${this.translation('driver')}</th>
                                <th class="text-center">${this.translation('grid')}</th>
                                <th class="text-center">${this.translation('points')}</th>
                                <th>${this.translation('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reduceArray(response.Results, this.config.row_limit).map(result => this.renderResultRow(result))}
                        </tbody>
                    </table>`)
                    .catch(() => html`${getApiErrorMessage('last result')}`),
            html`${getApiLoadingMessage()}`,
          )}`;
    }
}
