import {  formatTime, HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { formatDate } from "../lib/format_date";
import { Circuit, FormulaOneCardConfig, Race } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class Schedule extends BaseCard {
    
    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass, config);
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
                <td class="text-center">${formatTime(raceDate, this.hass.locale)}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        const data = this.sensor.data as Race[];
        if(!this.sensor_entity_id.endsWith('_races') || data === undefined) {
            throw new Error('Please pass the correct sensor (races)')
        }

        return html`
        <table>
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>Race</th>
                    <th>Location</th>
                    <th class="text-center">Date</th>
                    <th class="text-center">Time</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(race => this.renderScheduleRow(race))}
            </tbody>
        </table>
      `;
    }
}
