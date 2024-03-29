import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import { getApiErrorMessage, getApiLoadingMessage, getEndOfSeasonMessage, renderHeader, renderRaceInfo } from "../utils";
import { BaseCard } from "./base-card";
import { formatDateNumeric } from "../lib/format_date";

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
        'endofseason' : 'Season is over. See you next year!',
    };
    
    cardSize(): number {
        return 8;
    }
    
    render() : HTMLTemplateResult {
        return html`${until(
            this.client.GetSchedule(new Date().getFullYear()).then(response => {
                
                const delay = this.config.next_race_delay || 0;
                const nextRace = response.filter(race =>  {
                    const nextRaceDate = new Date(race.date + 'T' + race.time);

                    // Add the delay to the hours of the next race
                    nextRaceDate.setHours(nextRaceDate.getHours() + delay);

                    return nextRaceDate >= new Date();
                })[0];

                if(!nextRace) {
                    return getEndOfSeasonMessage(this.translation('endofseason'));
                }                
                
                return html`<table>
                        <tbody>
                            <tr>
                                <td colspan="5">${renderHeader(this, nextRace)}</td>
                            </tr>
                            ${this.config.show_raceinfo ? 
                                renderRaceInfo(this, nextRace) : 
                                this.config.only_show_date ? 
                                    html`<tr>
                                        <td class="text-center">
                                            <h1 class="${(this.config.f1_font ? 'formulaone-font' : '')}">${formatDateNumeric(new Date(nextRace.date + 'T' + nextRace.time), this.hass.locale, this.config.date_locale)}</h1>
                                        </td>
                                    </tr>` : null
                                }  
                        </tbody>
                    </table>`
                }).catch(() => { 
                    return html`${getApiErrorMessage('next race')}`;
                }),
            html`${getApiLoadingMessage()}`
        )}`;
    }
}
