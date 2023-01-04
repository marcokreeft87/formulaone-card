// import { html, HTMLTemplateResult } from "lit-html";
// import { until } from 'lit-html/directives/until.js';
// import ErgastClient from "../api/ergast-client";
// import { Race, Result, Season } from "../api/models";
// import { FormulaOneCardConfig } from "../types/formulaone-card-types";
// import { getApiErrorMessage, getApiLoadingMessage, getCircuitName, getCountryFlagUrl, getDriverName } from "../utils";
// import { BaseCard } from "./base-card";

// export default class Results extends BaseCard {    
//     client: ErgastClient;
//     defaultTranslations = {
//         'driver' : 'Driver',   
//         'grid' : 'Grid',
//         'points' : 'Points',
//         'status' : 'Status',
//         'raceheader' : 'Race',
//         'seasonheader' : 'Season',
//     };
//     results: Result[] = [];
//     races: Race[] = [];
//     selectedRace: Race;
//     selectedSeason: Season;

//     constructor(config: FormulaOneCardConfig) {
//         super(config);
//     }

//     async getSeasonRaces(season: number) : Promise<Race[]> {
//         return this.client.GetSeasonRaces(season);
//     }

//     async getData() : Promise<Result[]> {
//         return this.client.GetResults(2022, 22).then(value => value.Races[0].Results);
//     }
    
//     cardSize(): number {
//         // const data = this.sensor.data as Race;
//         // if(!data || !data.Results) {
//         //     return 2;
//         // }

//         // return (data.Results.length == 0 ? 1 : data.Results.length / 2 ) + 1;
//         return 2;
//     }

//     renderResultRow(result: Result): HTMLTemplateResult {

//         return html`
//             <tr>
//                 <td class="width-50 text-center">${result}</td>
//                 <td>${getDriverName(result.Driver, this.config)}</td>
//                 <td>${result.grid}</td>
//                 <td class="width-60 text-center">${result.points}</td>
//                 <td class="width-50 text-center">${result.status}</td>
//             </tr>`;
//     }

//     renderHeader(): HTMLTemplateResult {
        
//         if(!this.selectedRace) {
//             return null;
//         }

//         const data = this.selectedRace;
//         const countryDashed = data.Circuit.Location.country.replace(" ","-");
//         const circuitName = getCircuitName(countryDashed);
//         const imageHtml = html`<img width="100%" src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png">`;
//         const imageWithLinkHtml = this.config.image_clickable ? html`<a target="_new" href="${data.Circuit.url}">${imageHtml}</a>` : imageHtml;

//         return html`<h2><img height="25" src="${getCountryFlagUrl(data.Circuit.Location.country)}">&nbsp;  ${data.round} :  ${data.raceName}</h2>${imageWithLinkHtml}<br> `
//     }

//     async selectedSeasonChanged(ev: any): Promise<any> {
//         const option = ev.detail.item.innerText;
//         console.log('Season', option);

//         this.getSeasonRaces(option).then(response => this.races = response);
//         // const selected = this.stateObj.state;
//         // if (ev.detail && ev.detail.item) {
//         //   this.setScrollTop(ev.detail.item.offsetTop);
//         // }
//         // if (option === selected) {
//         //   return;
//         // }
//         // await SelectListCard.setInputSelectOption(this.hass, this.config.entity, option);
//     }
    
//     async selectedRaceChanged(ev: any): Promise<any> {
//         const option = ev.detail.item.innerText;
//         console.log('Race', option);

//         //this.getSeasonRaces(option).then(response => this.races = response);
//         // const selected = this.stateObj.state;
//         // if (ev.detail && ev.detail.item) {
//         //   this.setScrollTop(ev.detail.item.offsetTop);
//         // }
//         // if (option === selected) {
//         //   return;
//         // }
//         // await SelectListCard.setInputSelectOption(this.hass, this.config.entity, option);
//     }

//     render() : HTMLTemplateResult {

//         //const data = this.client.GetResults(2022, 22);

//         // const data = this.sensor.data as Race;
//         // if(!this.sensor_entity_id.endsWith('_last_result') || data === undefined) {
//         //     throw new Error('Please pass the correct sensor (last_result)')
//         // }
//         /* 
//          <select name="selectedSeason">
//                             ${this.seasons.map(season => `<option value="${season.season}">${season.season}</option>`)}
//                         </select> 
                        
//                         style="${style}"
//                          ${this.seasons.map(season => `<option value="${season.season}">${season.season}</option>`)}


//                         ${until(
//                             this.client.GetSeasons().then(response => response
//                               ? html`<paper-select
//                                     id="seasons"
//                                     label="${this.translation('seasonheader')}"
//                                     @iron-select=${this.selectedSeasonChanged}
//                                     .selected=${response.indexOf(this.selectedSeason)}>
//                                     ${response.map(season => {
//                                         return html`<paper-item>${season.season}</paper-item>`;
//                                     })}
//                                 </paper-select>`
//                               : html`Error getting seasons`),
//                             html`Loading...`,
//                           )} 


//                         */

        
//         return html`   
//             <table>
//                 <tr>
//                     <td> 
//                         ${this.translation('seasonheader')}&nbsp;                       
//                         ${until(
//                             this.client.GetSeasons().then(response => { 
//                                     const seasons = response?.reverse();
//                                     seasons
//                                     ? html`<select name="selectedSeason">
//                                             ${seasons.map(season => {
//                                                 return html`<option value="${season.season}">${season.season}</option>`;
//                                             })}
//                                         </select>`
//                                     : html`${getApiErrorMessage('seasons')}`
//                                 }),
//                             html`${getApiLoadingMessage()}`,
//                           )}                 
//                     </td>
//                     <td>
//                         ${this.translation('raceheader')}&nbsp;
//                         <paper-listbox
//                             id="races"
//                             label="${this.translation('raceheader')}"
//                             @iron-select=${this.selectedRaceChanged}
//                             .selected=${this.races.indexOf(this.selectedRace)}>
//                             ${this.races.map(race => {
//                                 return html`<paper-item>${race.round} ${race.raceName}</paper-item>`;
//                             })}
//                         </paper-listbox>     
//                     </td>
//                 </tr>
//                 <tr>
//                     <td colspan="2">${this.renderHeader()}</td>
//                 </tr>
//             </table>
//             <table>
//                 <thead>                    
//                     <tr>
//                         <th>&nbsp;</th>
//                         <th>${this.translation('driver')}</th>
//                         <th class="text-center">${this.translation('grid')}</th>
//                         <th class="text-ccenter">${this.translation('points')}</th>
//                         <th>${this.translation('status')}</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${this.results.map(result => this.renderResultRow(result))}
//                 </tbody>
//             </table>
//         `;

//     //     return html`       

//     //         <table>
//     //             <tr>
//     //                 <td>${this.renderHeader()}</td>
//     //             </tr>
//     //         </table>
//     //         <table>
//     //             <thead>                    
//     //                 <tr>
//     //                     <th>&nbsp;</th>
//     //                     <th>${this.translation('driver')}</th>
//     //                     <th class="text-center">${this.translation('grid')}</th>
//     //                     <th class="text-ccenter">${this.translation('points')}</th>
//     //                     <th>${this.translation('status')}</th>
//     //                 </tr>
//     //             </thead>
//     //             <tbody>
//     //                 ${data.Results.map(result => this.renderResultRow(result))}
//     //             </tbody>
//     //         </table>
//     //   `;
//     }
// }
