// import { HomeAssistant } from "custom-card-helpers";
// import { html, HTMLTemplateResult } from "lit-html";
// import { until } from 'lit-html/directives/until.js';
// import { Race } from "../api/models";
// import { formatDateNumeric } from "../lib/format_date";
// import { formatDateTimeRaceInfo } from "../lib/format_date_time";
// import { FormulaOneCardConfig } from "../types/formulaone-card-types";
// import { getApiErrorMessage, getApiLoadingMessage, getCircuitName, getCountryFlagByName, getEndOfSeasonMessage } from "../utils";
// import { BaseCard } from "./base-card";

// export default class Countdown extends BaseCard {
//     hass: HomeAssistant;
//     defaultTranslations = {
//         'date' : 'Date',   
//         'practice1' : 'Practice 1',
//         'practice2' : 'Practice 2',
//         'practice3' : 'Practice 3',
//         'race' : 'Race',
//         'racename' : 'Race name',
//         'circuitname' : 'Circuit name',
//         'location' : 'Location',
//         'city': 'City',
//         'racetime' : 'Race',
//         'sprint' : 'Sprint',
//         'qualifying' : 'Qualifying',
//         'endofseason' : 'Season is over. See you next year!',
//         'racenow' : 'We are racing!'
//     };
//     raceDate: Date;

//     constructor(hass: HomeAssistant, config: FormulaOneCardConfig) {
//         super(config);

//         this.hass = hass;
//     }   
    
//     cardSize(): number {
//         return 8;
//     }

//     startCountdown(raceDateTime: Date) {
//         const now = new Date().getTime();

//         const countdownTimer = setInterval(function() {
//             const distance = raceDateTime.getTime() - now;

//             const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//             const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//             const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//             const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//             document.getElementById("countdown-timer").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s `;

//             if (distance < 0) {
//                 clearInterval(countdownTimer);
//                 document.getElementById("countdown-timer").innerHTML = this.translation('racenow');
//             }
//         }, 1000);
//     }

//     renderHeader(race: Race): HTMLTemplateResult {
        
//         const countryDashed = race.Circuit.Location.country.replace(" ","-")
//         //const circuitName = getCircuitName(countryDashed);

//         return html`<h1 id="countdown-timer"></h1><h2><img height="25" src="${getCountryFlagByName(race.Circuit.Location.country)}">&nbsp;  ${race.round} :  ${race.raceName}</h2><br> `
//     }
    
//     render() : HTMLTemplateResult {

//         return html`${until(
//             this.client.GetSchedule(new Date().getFullYear()).then(response => {
//                 if(!response) {
//                     return html`${getApiErrorMessage('next race')}`
//                 }

//                 const next_race = response.filter(race =>  {
//                     return new Date(race.date + 'T' + race.time) >= new Date();
//                 })[0];

//                 if(!next_race) {
//                     return getEndOfSeasonMessage(this.translation('endofseason'));
//                 }

//                 this.raceDate = new Date(next_race.date + 'T' + next_race.time);
//                 const freePractice1 = formatDateTimeRaceInfo(new Date(next_race.FirstPractice.date + 'T' + next_race.FirstPractice.time), this.hass.locale);
//                 const freePractice2 = formatDateTimeRaceInfo(new Date(next_race.SecondPractice.date + 'T' + next_race.SecondPractice.time), this.hass.locale);
//                 const freePractice3 = next_race.ThirdPractice !== undefined ? formatDateTimeRaceInfo(new Date(next_race.ThirdPractice.date + 'T' + next_race.ThirdPractice.time), this.hass.locale) : '-';
//                 const raceDateFormatted = formatDateTimeRaceInfo(this.raceDate, this.hass.locale);
//                 const qualifyingDate = formatDateTimeRaceInfo(new Date(next_race.Qualifying.date + 'T' + next_race.Qualifying.time), this.hass.locale);
//                 const sprintDate = next_race.Sprint !== undefined ? formatDateTimeRaceInfo(new Date(next_race.Sprint.date + 'T' + next_race.Sprint.time), this.hass.locale) : '-';
        
//                 return html`<table>
//                         <tbody>
//                             <tr>
//                                 <td colspan="5">${this.renderHeader(next_race)}</td>
//                             </tr>
//                             <tr><td>${this.translation('date')}</td><td>${formatDateNumeric(this.raceDate, this.hass.locale, this.config.date_locale)}</td><td>&nbsp;</td><td>${this.translation('practice1')}</td><td align="right">${freePractice1}</td></tr>
//                             <tr><td>${this.translation('race')}</td><td>${next_race.round}</td><td>&nbsp;</td><td>${this.translation('practice2')}</td><td align="right">${freePractice2}</td></tr>
//                             <tr><td>${this.translation('racename')}</td><td>${next_race.raceName}</td><td>&nbsp;</td><td>${this.translation('practice3')}</td><td align="right">${freePractice3}</td></tr>
//                             <tr><td>${this.translation('circuitname')}</td><td>${next_race.Circuit.circuitName}</td><td>&nbsp;</td><td>${this.translation('qualifying')}</td><td align="right">${qualifyingDate}</td></tr>
//                             <tr><td>${this.translation('location')}</td><td>${next_race.Circuit.Location.country}</td><td>&nbsp;</td><td>${this.translation('sprint')}</td><td align="right">${sprintDate}</td></tr>        
//                             <tr><td>${this.translation('city')}</td><td>${next_race.Circuit.Location.locality}</td><td>&nbsp;</td><td>${this.translation('racetime')}</td><td align="right">${raceDateFormatted}</td></tr>        
//                         </tbody>
//                     </table>`
//                 }),
//             html`${getApiLoadingMessage()}`
//         )}`;
//     }

//     afterRender(): void {
//         this.startCountdown(this.raceDate);
//     }
// }
