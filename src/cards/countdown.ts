import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import { getApiErrorMessage, getApiLoadingMessage, getCountryFlagByName, getEndOfSeasonMessage, renderHeader, renderRaceInfo } from "../utils";
import { BaseCard } from "./base-card";
import { asyncReplace } from 'lit/directives/async-replace.js';
import { Race } from "../api/models";
import { HomeAssistant } from "custom-card-helpers";
import { FormulaOneCardConfig } from "../types/formulaone-card-types";

export default class Countdown extends BaseCard {
    hass: HomeAssistant;
    defaultTranslations = {
        'days' : 'd',   
        'hours' : 'h',
        'minutes' : 'm',
        'seconds' : 's',
        'endofseason' : 'Season is over. See you next year!',
        'racenow' : 'We are racing!',
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
        'qualifying' : 'Qualifying'
    };

    constructor(hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(config);        

        this.hass = hass;
    }
    
    cardSize(): number {
        return this.config.show_raceinfo ? 12 : 6;
    }

    renderHeader(race: Race): HTMLTemplateResult {        
        return this.config.show_raceinfo ? 
            html`<table><tr><td colspan="5">${renderHeader(this.config, race, true)}</td></tr>
            ${renderRaceInfo(this.hass, this.config, race, this)}</table>`
            : null;
    }

    async *countDownTillDate(raceDateTime: Date) {

        while (raceDateTime > new Date()) {

            const now = new Date().getTime();
            const distance = raceDateTime.getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            yield `${days}${this.translation('days')} ${hours}${this.translation('hours')} ${minutes}${this.translation('minutes')} ${seconds}${this.translation('seconds')} `;

            /* istanbul ignore next */
            await new Promise((r) => setTimeout(r, 1000));
        }

        yield this.translation('racenow');
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetSchedule(new Date().getFullYear()).then(response => {
                if(!response) {
                    return html`${getApiErrorMessage('next race')}`
                }

                const nextRace = response.filter(race =>  {
                    const raceDateTime = new Date(race.date + 'T' + race.time);
                    raceDateTime.setHours(raceDateTime.getHours() + 3);
                    return raceDateTime >= new Date();
                })[0];

                if(!nextRace) {
                    return getEndOfSeasonMessage(this.translation('endofseason'));
                }

                const raceDateTime = new Date(nextRace.date + 'T' + nextRace.time);
                const timer = this.countDownTillDate(raceDateTime);
                
                return html`<table>
                                <tr>
                                    <td>
                                        <h2><img height="25" src="${getCountryFlagByName(nextRace.Circuit.Location.country)}">&nbsp;&nbsp;  ${nextRace.round} :  ${nextRace.raceName}</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center">
                                        <h1>${asyncReplace(timer)}</h1>
                                    </td>
                                </tr>
                            </table>
                            ${this.renderHeader(nextRace)}`;

            }),
            html`${getApiLoadingMessage()}`
        )}`;
    }
}
