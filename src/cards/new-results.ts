import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { QualifyingResult, Race, Result } from "../api/models";
import { FormulaOneCardTab, mwcTabBarEvent } from "../types/formulaone-card-types";
import { getApiErrorMessage, getApiLoadingMessage, getCountryFlagByNationality, getDriverName, reduceArray, renderConstructorColumn, renderHeader } from "../utils";
import { BaseCard } from "./base-card";

export default class NewResults extends BaseCard {    

    protected selectedTabIndex = 0; //TODO moet property worden. CardValues?
    
    defaultTranslations = {
        'driver' : 'Driver',   
        'grid' : 'Grid',
        'team' : 'Team',
        'points' : 'Points',
        'status' : 'Status',
        'raceheader' : 'Race',
        'seasonheader' : 'Season',
        'selectseason' : 'Select season',
        'selectrace' : 'Select race',
        'noresults' : 'Please select a race thats already been run.',        
        'q1' : 'Q1',
        'q2' : 'Q2',
        'q3' : 'Q3',
    };

    constructor(parent: FormulaOneCard) {
        super(parent);    
    } 
    
    cardSize(): number {
        return 12;
    }

    renderTabs(selectedRace: Race) : FormulaOneCardTab[] {
        const tabs: FormulaOneCardTab[] = [{
            title: 'Results',
            icon: 'mdi:trophy',
            content: this.renderResults(selectedRace)
        }];

        if(selectedRace.QualifyingResults) {
            tabs.push({
                title: 'Qualifying',
                icon: 'mdi:timer-outline',
                content: this.renderQualifying(selectedRace)
            });
        }

        return tabs;
    }

    renderQualifying(selectedRace: Race): HTMLTemplateResult {
        return selectedRace ?
            html`<table class="nopadding">
                    <thead>                   
                        <tr>
                            <th>&nbsp;</th>
                            <th>${this.translation('driver')}</th>
                            ${(this.config.standings?.show_team ? html`<th>${this.translation('team')}</th>` : '')}
                            <th class="text-center">${this.translation('q1')}</th>
                            <th class="text-center">${this.translation('q2')}</th>
                            <th class="text-center">${this.translation('q3')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reduceArray(selectedRace.QualifyingResults, this.config.row_limit).map(result => this.renderQualifyingResultRow(result))}
                    </tbody>
                </table>` 
        : html`<table class="nopadding">
                    <tr>
                        <td>${this.translation('noresults')}</td>
                    </tr>
                </table>`;
    }

    renderResults(selectedRace: Race): HTMLTemplateResult {
        return selectedRace ?
            html`<table class="nopadding">
                    <thead>                    
                        <tr>
                            <th>&nbsp;</th>
                            <th>${this.translation('driver')}</th>
                            ${(this.config.standings?.show_team ? html`<th>${this.translation('team')}</th>` : '')}
                            <th class="text-center">${this.translation('grid')}</th>
                            <th class="text-center">${this.translation('points')}</th>
                            <th>${this.translation('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reduceArray(selectedRace.Results, this.config.row_limit).map(result => this.renderResultRow(result))}
                    </tbody>
                </table>` 
        : html`<table class="nopadding">
                    <tr>
                        <td>${this.translation('noresults')}</td>
                    </tr>
                </table>`;
    }

    renderResultRow(result: Result): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(result.Driver.nationality)}">&nbsp;` : '')}${getDriverName(result.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`${renderConstructorColumn(this.config, result.Constructor)}` : '')}
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="width-50 text-center">${result.status}</td>
            </tr>`;
    }

    renderQualifyingResultRow(result: QualifyingResult): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(result.Driver.nationality)}">&nbsp;` : '')}${getDriverName(result.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`${renderConstructorColumn(this.config, result.Constructor)}` : '')}
                <td>${result.Q1}</td>
                <td>${result.Q2}</td>
                <td>${result.Q3}</td>
            </tr>`;
    }

    renderHeader(race?: Race): HTMLTemplateResult {
        
        if(race === null || race === undefined || parseInt(race.season) < 2018) {
            return null;
        }

        return renderHeader(this, race);
    }

    render() : HTMLTemplateResult {
        const { races, selectedRace, selectedSeason, selectedTabIndex } = this.getProperties();

        if(selectedSeason === undefined) {
            this.client.GetLastResult().then(response => { 

                const { properties, cardValues } = this.getParentCardValues();
                properties.selectedSeason = response.season;

                this.client.GetQualifyingResults(parseInt(response.season), parseInt(response.round)).then(qualifyingResults => {
                    const race = response;
                    race.QualifyingResults = qualifyingResults.Races[0].QualifyingResults;

                    properties.selectedRace = race;
                    this.client.GetSeasonRaces(parseInt(response.season)).then(racesResponse => {    
                        properties.races = racesResponse;
    
                        cardValues.set('cardValues', properties);   
                        this.parent.properties = cardValues;
                    }); 
                });            
            })
        }
       
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedSeasonChanged = (ev: any): void => {
            const selectedSeason: number = ev.target.value;     
            const { properties, cardValues } = this.getParentCardValues();

            properties.selectedSeason = selectedSeason;
            this.client.GetSeasonRaces(selectedSeason).then(response => {    
                properties.selectedRace = undefined; 
                properties.races = response;
                properties.results = undefined;
                cardValues.set('cardValues', properties);
                this.parent.properties = cardValues;
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedRaceChanged = (ev: any): void => {
            const round = ev.target.value;
            const { properties, cardValues } = this.getParentCardValues();
    
            properties.selectedRound = round;
            this.client.GetResults(properties.selectedSeason as number, round).then(response => {

                this.client.GetQualifyingResults(parseInt(response.season), parseInt(response.round)).then(qualifyingResults => {
                    const race = response.Races[0];
                    race.QualifyingResults = qualifyingResults.Races[0].QualifyingResults;

                    properties.selectedRace = race;
                    cardValues.set('cardValues', properties);
                    this.parent.properties = cardValues;
                });
            });
        }

        const tabs = this.renderTabs(selectedRace);

        //https://github.com/kinghat/tabbed-card/blob/main/src/tabbed-card.ts
        return html`
        <table>
            <tr>
                <td> 
                    ${this.translation('seasonheader')}<br />                      
                    ${until(
                        this.client.GetSeasons().then(response => { 
                                const seasons = response?.reverse();
                                return seasons
                                ? html`<select name="selectedSeason" @change="${selectedSeasonChanged}">
                                        <option value="0">${this.translation('selectseason')}</option>
                                        ${seasons.map(season => {
                                            return html`<option value="${season.season}" ?selected=${selectedSeason === season.season}>${season.season}</option>`;
                                        })}
                                    </select>`
                                : html`${getApiErrorMessage('seasons')}`;
                            }),
                        html`${getApiLoadingMessage()}`,
                        )}                 
                </td>
                <td>
                    ${this.translation('raceheader')}<br />
                    <select name="selectedRace" @change="${selectedRaceChanged}">
                        <option value="0" ?selected=${selectedRace === undefined}>${this.translation('selectrace')}</option>
                        ${races?.map(race => {
                            return html`<option value="${race.round}" ?selected=${selectedRace?.round == race.round}>${race.raceName}</option>`;
                        })}
                    </select>
                </td>
            </tr>
            ${selectedRace 
                ? html`<tr><td colspan="2">${this.renderHeader(selectedRace)}</td></tr>
                        <tr>
                            <td colspan="2">
                                <mwc-tab-bar
                                @MDCTabBar:activated=${(ev: mwcTabBarEvent) => 
                                    (this.setSelectedTabIndex(ev.detail.index))}
                            >
                            ${tabs.map(
                                (tab) =>  html`
                                        <mwc-tab
                                        label="${tab.title}"
                                        ?hasImageIcon=${tab.icon}
                                        >
                                        ${tab.icon
                                            ? html`<ha-icon
                                                slot="icon"
                                                icon="${tab.icon}"
                                            ></ha-icon>`
                                            : html``}
                                        </mwc-tab>
                                    `,
                                )}                    
                            </mwc-tab-bar>
                            <section>
                                <article>
                                ${tabs.find((_, index) => index == selectedTabIndex)?.content}
                                </article>
                            </section>
                            </td>
                        </tr>` 
                : html``}
        </table>`;
    }
    
    setSelectedTabIndex(index: number) {
        
        const { properties, cardValues } = this.getParentCardValues();
        properties.selectedTabIndex = index;
        cardValues.set('cardValues', properties);
        this.parent.properties = cardValues;
    }
}
