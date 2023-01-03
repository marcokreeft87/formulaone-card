import {  formatTime, HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import { Circuit, Race } from "../api/models";
import { formatDate } from "../lib/format_date";
import { FormulaOneCardConfig } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class Schedule extends BaseCard {
    defaultTranslations = {
        'date' : 'Date',   
        'race' : 'Race',
        'time' : 'Time',
        'location' : 'Location',
        'endofseason' : 'Season is over. See you next year!'
    };
    
    constructor(hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(hass, config);
    }   
    
    cardSize(): number {
        return 2;
        // const data = this.sensor.data as Race[];        
        // if(!data) {
        //     return 2;
        // }

        // return (data.length == 0 ? 1 : data.length / 2 ) + 1;
    }

    renderSeasonEnded(): HTMLTemplateResult {
        return html`<table><tr><td class="text-center"><strong>${this.translation('endofseason')}</strong></td></tr></table>`;
    }

    renderLocation(circuit: Circuit) {
        const locationConcatted = `${circuit.Location.locality}, ${circuit.Location.country}`;
        return this.config.location_clickable ? html`<a href="${circuit.url}" target="_blank">${locationConcatted}</a>` : locationConcatted;
    }

    renderScheduleRow(race: Race): HTMLTemplateResult {
        const raceDate = new Date(race.date + 'T' + race.time);
        const renderClass = this.config.previous_race && raceDate < new Date() ? this.config.previous_race : '';

        return html`
            <tr class="${renderClass}"> 
                <td class="width-50 text-center">${race.round}</td>
                <td>${race.Circuit.circuitName}</td>
                <td>${this.renderLocation(race.Circuit)}</td>
                <td class="width-60 text-center">${formatDate(raceDate, this.hass.locale, this.config.date_locale)}</td>
                <td class="width-50 text-center">${formatTime(raceDate, this.hass.locale)}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.client.GetSchedule().then(response => {
                const next_race = response?.filter(race =>  {
                    return new Date(race.date + 'T' + race.time) >= new Date();
                })[0];

                if(!next_race) {
                    return this.renderSeasonEnded();
                }

                response ? 
                    html`
                        <table>
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>${this.translation('race')}</th>
                                    <th>${this.translation('location')}</th>
                                    <th class="text-center">${this.translation('date')}</th>
                                    <th class="text-center">${this.translation('time')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${response.map(race => this.renderScheduleRow(race))}
                            </tbody>
                        </table>`
                : html`Error getting schedule`
            }),
            html`Loading...`
        )}`;
    }
}
