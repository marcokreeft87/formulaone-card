import { formatTime, HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { formatDate } from "../lib/format_date";
import { PreviousRaceDisplay } from "../types/formulaone-card-types";
import { getApiErrorMessage, getApiLoadingMessage, getEndOfSeasonMessage, reduceArray } from "../utils";
import { BaseCard } from "./base-card";
import { SportsTimesClient } from "../api/sportstimes-client";
import { SportsTimesRace } from "../types/sportstimes-types";

export default class Schedule extends BaseCard {

    hass: HomeAssistant;
    defaultTranslations = {
        'date' : 'Date',   
        'race' : 'Race',
        'time' : 'Time',
        'location' : 'Location',
        'endofseason' : 'Season is over. See you next year!'
    };

    constructor(parent: FormulaOneCard) {
        super(parent);    
    }    
    
    cardSize(): number {
        return 12;
    }

    renderLocation(race: SportsTimesRace) {
        return `${race.name}, ${race.location}`;
    }

    renderScheduleRow(race: SportsTimesRace): HTMLTemplateResult {
        const raceDate = new Date(race.sessions.gp);
        const renderClass = this.config.previous_race && raceDate < new Date() ? this.config.previous_race : '';

        return html`
            <tr class="${renderClass}">
                <td class="width-50 text-center">${race.round}</td>
                <td>${race.location}</td>
                <td>${this.renderLocation(race)}</td>
                <td class="width-60 text-center">${formatDate(raceDate, this.hass.locale, this.config.date_locale)}</td>
                <td class="width-50 text-center">${formatTime(raceDate, this.hass.locale)}</td>
            </tr>`;
    }

    render() : HTMLTemplateResult {

        return html`${until(
            this.sportsTimesClient.GetSchedule(new Date().getFullYear()).then(response => {

                const schedule = this.config.previous_race === PreviousRaceDisplay.Hide ? response.filter(race => {
                    return new Date(race.sessions.gp) >= new Date();
                }) : response;

                const next_race = schedule.filter(race =>  {
                    return new Date(race.sessions.gp) >= new Date();
                })[0];
                if(!next_race) {
                    return getEndOfSeasonMessage(this.translation('endofseason'));
                }

                return html`<table>
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
                                ${reduceArray(schedule, this.config.row_limit).map(race => this.renderScheduleRow(race))}
                            </tbody>
                        </table>`;
            }).catch(() => {
                return html`${getApiErrorMessage('schedule')}`
            }),
            html`${getApiLoadingMessage()}`
        )}`;
    }
}