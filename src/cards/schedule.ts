import {  formatTime, HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { formatDate } from "../lib/format_date";
import { FormulaOneCardConfig, Race } from "../types/formulaone-card-types";
import { BaseCard } from "./base-card";

export default class Schedule extends BaseCard {

    date_locale?: string;
    
    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass);

        this.date_locale = config.date_locale;
    } 

    renderScheduleRow(race: Race): HTMLTemplateResult {
        const raceDate = new Date(race.date + 'T' + race.time);

        return html`
            <tr>
                <td class="width-50 text-center">${race.round}</td>
                <td>${race.Circuit.circuitName}</td>
                <td>${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</td>
                <td class="width-60 text-center">${formatDate(raceDate, this.hass.locale, this.date_locale)}</td>
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
