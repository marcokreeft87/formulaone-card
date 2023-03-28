import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import { getApiErrorMessage, getApiLoadingMessage, getEndOfSeasonMessage, renderHeader, renderRaceInfo } from "../utils";
import { BaseCard } from "./base-card";

export default class NextRace extends BaseCard {
    hass: HomeAssistant;
    defaultTranslations = {
        'date' : 'Date',   
        'practice1' : 'Practice 1',
        'practice2' : 'Practice 2',
        'practice3' : 'Practice 3',
        'race' : 'Race',
        'racename' : 'Race name',
        'circuitname' : 'Circuit name',
        'location' : 'Location',
        'city': 'City',
        'racetime' : 'Race',
        'sprint' : 'Sprint',
        'qualifying' : 'Qualifying',
        'endofseason' : 'Season is over. See you next year!'
    };
    
    cardSize(): number {
        return 8;
    }
    
    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetSchedule(new Date().getFullYear()).then(response => {
                const nextRace = response.filter(race =>  {
                    return new Date(race.date + 'T' + race.time) >= new Date();
                })[0];

                if(!nextRace) {
                    return getEndOfSeasonMessage(this.translation('endofseason'));
                }
                
                return html`<table>
                        <tbody>
                            <tr>
                                <td colspan="5">${renderHeader(this, nextRace)}</td>
                            </tr>
                            ${renderRaceInfo(this, nextRace)}    
                        </tbody>
                    </table>`
                }).catch(() => { 
                    return html`${getApiErrorMessage('next race')}`;
                }),
            html`${getApiLoadingMessage()}`
        )}`;
    }
}
