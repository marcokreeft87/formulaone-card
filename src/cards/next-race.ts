import { HomeAssistant } from "custom-card-helpers";
import { html, HTMLTemplateResult } from "lit-html";
import { formatDateNumeric } from "../lib/format_date";
import { formatDateTimeRaceInfo } from "../lib/format_date_time";
import { FormulaOneCardConfig, Race } from "../types/formulaone-card-types";
import { getCircuitName, getCountryFlagByName } from "../utils";
import { BaseCard } from "./base-card";

export default class NextRace extends BaseCard {
    
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

    next_race: Race;

    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        super(sensor, hass, config);

        const sensorEntity = this.hass.states[this.sensor_entity_id];

        this.next_race = sensorEntity.attributes['next_race'] as Race;
    }   
    
    cardSize(): number {
        const data = this.next_race;
        if(!data) {
            return 2;
        }

        return 8;
    }

    renderHeader(): HTMLTemplateResult {
        
        const countryDashed = this.next_race.Circuit.Location.country.replace(" ","-")
        const circuitName = getCircuitName(countryDashed);

        const imageHtml = html`<img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png">`;
        const imageWithLinkHtml = this.config.image_clickable ? html`<a target="_new" href="${this.next_race.Circuit.url}">${imageHtml}</a>` : imageHtml;

        return html`<h2><img height="25" src="${getCountryFlagByName(this.next_race.Circuit.Location.country)}">&nbsp;  ${this.next_race.round} :  ${this.next_race.raceName}</h2>${imageWithLinkHtml}<br> `
    }

    renderSeasonEnded(): HTMLTemplateResult {
        return html`<table><tr><td class="text-center"><strong>${this.translation('endofseason')}</strong></td></tr></table>`;
    }

    render() : HTMLTemplateResult {

        if(!this.sensor_entity_id.endsWith('_races') || this.next_race === undefined) {
            throw new Error('Please pass the correct sensor (races)')
        }

        if(!this.next_race) {
            return this.renderSeasonEnded();
        }

        const raceDate = new Date(this.next_race.date + 'T' + this.next_race.time);
        const freePractice1 = formatDateTimeRaceInfo(new Date(this.next_race.FirstPractice.date + 'T' + this.next_race.FirstPractice.time), this.hass.locale);
        const freePractice2 = formatDateTimeRaceInfo(new Date(this.next_race.SecondPractice.date + 'T' + this.next_race.SecondPractice.time), this.hass.locale);
        const freePractice3 = this.next_race.ThirdPractice !== undefined ? formatDateTimeRaceInfo(new Date(this.next_race.ThirdPractice.date + 'T' + this.next_race.ThirdPractice.time), this.hass.locale) : '-';
        const raceDateFormatted = formatDateTimeRaceInfo(raceDate, this.hass.locale);
        const qualifyingDate = this.next_race.Qualifying !== undefined ? formatDateTimeRaceInfo(new Date(this.next_race.Qualifying.date + 'T' + this.next_race.Qualifying.time), this.hass.locale) : '-';
        const sprintDate = this.next_race.Sprint !== undefined ? formatDateTimeRaceInfo(new Date(this.next_race.Sprint.date + 'T' + this.next_race.Sprint.time), this.hass.locale) : '-';

        return html`       

            <table>
                <tbody>
                    <tr>
                        <td colspan="5">${this.renderHeader()}</td>
                    </tr>
                    <tr><td>${this.translation('date')}</td><td>${formatDateNumeric(raceDate, this.hass.locale, this.config.date_locale)}</td><td>&nbsp;</td><td>${this.translation('practice1')}</td><td align="right">${freePractice1}</td></tr>
                    <tr><td>${this.translation('race')}</td><td>${this.next_race.round}</td><td>&nbsp;</td><td>${this.translation('practice2')}</td><td align="right">${freePractice2}</td></tr>
                    <tr><td>${this.translation('racename')}</td><td>${this.next_race.raceName}</td><td>&nbsp;</td><td>${this.translation('practice3')}</td><td align="right">${freePractice3}</td></tr>
                    <tr><td>${this.translation('circuitname')}</td><td>${this.next_race.Circuit.circuitName}</td><td>&nbsp;</td><td>${this.translation('qualifying')}</td><td align="right">${qualifyingDate}</td></tr>
                    <tr><td>${this.translation('location')}</td><td>${this.next_race.Circuit.Location.country}</td><td>&nbsp;</td><td>${this.translation('sprint')}</td><td align="right">${sprintDate}</td></tr>        
                    <tr><td>${this.translation('city')}</td><td>${this.next_race.Circuit.Location.locality}</td><td>&nbsp;</td><td>${this.translation('racetime')}</td><td align="right">${raceDateFormatted}</td></tr>        
                </tbody>
            </table>
      `;
    }
}
