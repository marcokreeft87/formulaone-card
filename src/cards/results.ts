import { html, HTMLTemplateResult } from "lit-html";
import { until } from 'lit-html/directives/until.js';
import FormulaOneCard from "..";
import { QualifyingResult, Race, Result, Season } from "../api/f1-models";
import { CustomIcons, F1DataSource, FormulaOneCardTab, mwcTabBarEvent, SelectChangeEvent } from "../types/formulaone-card-types";
import { getApiErrorMessage, getApiLoadingMessage, getCountryFlagByNationality, getDriverName, reduceArray, renderConstructorColumn, renderHeader, translateStatus } from "../utils";
import { BaseCard } from "./base-card";

export default class Results extends BaseCard {    
    
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
        'finished' : 'Finished',
        'retired' : 'Retired',
        'disqualified' : 'Disqualified',
        'notclassified' : 'Not classified'
    };

    icons: CustomIcons = {
        'sprint' : 'mdi:flag-checkered',
        'qualifying' : 'mdi:timer-outline',
        'results' : 'mdi:trophy',
    }

    constructor(parent: FormulaOneCard) {
        super(parent);    

        if (this.config.source === F1DataSource.F1Sensor)
            throw new Error('F1Sensor is not supported for this card type. Please use source: jolpi.');
    } 
    
    cardSize(): number {
        return 12;
    }

    renderTabs(selectedRace: Race) : FormulaOneCardTab[] {
        const tabs: FormulaOneCardTab[] = [{
            title: 'Results',
            icon: this.icon('results'),
            content: this.renderResults(selectedRace),
            order: this.tabOrder('results')
        }, {
            title: 'Qualifying',
            icon: this.icon('qualifying'),
            content: this.renderQualifying(selectedRace),
            order: this.tabOrder('qualifying')
        }, {
            title: 'Sprint',
            icon: this.icon('sprint'),
            content: this.renderSprint(selectedRace),
            hide: !selectedRace?.SprintResults,
            order: this.tabOrder('sprint')
        }];

        return tabs.sort((a, b) => a.order - b.order);
    }

    renderSprint(selectedRace: Race) : HTMLTemplateResult {
        return selectedRace?.SprintResults ? 
            html`<table class="nopadding">
                    <thead>                    
                        <tr>
                            <th>&nbsp;</th>
                            <th>${this.translation('driver')}</th>
                            ${(this.config.standings?.show_team ? html`<th>${this.translation('team')}</th>` : '')}
                            <th class="text-center">${this.translation('grid')}</th>
                            <th class="text-center">${this.translation('points')}</th>
                            <th class="text-center">${this.translation('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reduceArray(selectedRace.SprintResults, this.config.row_limit).map(result => this.renderResultRow(result, false))}
                    </tbody>
                </table>`
            : null;
    }

    renderQualifying(selectedRace: Race): HTMLTemplateResult {
        return selectedRace?.QualifyingResults ?
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
            : null;
    }

    renderResults(selectedRace: Race): HTMLTemplateResult {
        const fastest = selectedRace?.Results?.filter((result) => result.FastestLap?.rank === '1')[0];
        return selectedRace?.Results ?
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
                        ${reduceArray(selectedRace.Results, this.config.row_limit).map(result => this.renderResultRow(result, result.position === fastest?.position))}
                    </tbody>
                    ${fastest ? html`
                    <tfoot>
                        <tr>
                            <td colspan="6" class="text-right"><small>* Fastest lap: ${fastest.FastestLap.Time.time}</small></td>
                        </tr>
                    </tfoot>` : ''}
                </table>` 
        : null;
    }

    renderResultRow(result: Result, fastest: boolean): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(this, result.Driver.nationality)}">&nbsp;` : '')}${getDriverName(result.Driver, this.config)}${fastest ? ' *' : ''}</td>
                ${(this.config.standings?.show_team ? html`${renderConstructorColumn(this, result.Constructor)}` : '')}
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="width-50 text-center">${translateStatus(result.status, this.config)}</td>
            </tr>`;
    }

    renderQualifyingResultRow(result: QualifyingResult): HTMLTemplateResult {
        return html`
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(this.config.standings?.show_flag ? html`<img height="10" width="20" src="${getCountryFlagByNationality(this, result.Driver.nationality)}">&nbsp;` : '')}${getDriverName(result.Driver, this.config)}</td>
                ${(this.config.standings?.show_team ? html`${renderConstructorColumn(this, result.Constructor)}` : '')}
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
            this.getLastResult();
        }
       
        const selectedSeasonChanged = (ev: SelectChangeEvent): void => {
            this.setRaces(ev);
        }

        const selectedRaceChanged = (ev: SelectChangeEvent): void => {
            this.setSelectedRace(ev);
        }

        const tabs = this.renderTabs(selectedRace);

        return html`
        <table>
            <tr>
                <td> 
                    ${this.translation('seasonheader')}<br />                      
                    ${until(
                        this.resultsClient.GetSeasons().then((response: Season[]) => { 
                            const seasons = response.reverse();
                                return html`<select name="selectedSeason" @change="${selectedSeasonChanged}">
                                        <option value="0">${this.translation('selectseason')}</option>
                                        ${seasons.map(season => {
                                            return html`<option value="${season.season}" ?selected=${selectedSeason === season.season}>${season.season}</option>`;
                                        })}
                                    </select>`;
                               
                            }).catch(() => {
                                return html`${getApiErrorMessage('seasons')}`;
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
        </table>
        ${this.renderTabsHtml(tabs, selectedTabIndex, selectedRace)}`;       
        
    }

    renderTabsHtml = (tabs: FormulaOneCardTab[], selectedTabIndex: number, selectedRace?: Race): HTMLTemplateResult => {
        return selectedRace 
            ? html`<table>
                        <tr><td colspan="2">${this.renderHeader(selectedRace)}</td></tr>
                        ${tabs.filter(tab => tab.content).length > 0 ?
                            html`<tr class="transparent">
                                <td colspan="2">
                                    <mwc-tab-bar
                                    @MDCTabBar:activated=${(ev: mwcTabBarEvent) => 
                                        (this.setSelectedTabIndex(ev.detail.index))}
                                >
                                ${tabs.filter(tab => !tab.hide).map(
                                    (tab) =>  html`
                                            <mwc-tab
                                            ?hasImageIcon=${tab.icon}
                                            ><ha-icon
                                                    slot="icon"
                                                    icon="${tab.icon}"
                                                ></ha-icon>
                                            </mwc-tab>
                                        `,
                                    )}                    
                                </mwc-tab-bar>
                                <section>
                                    <article>
                                    ${tabs.filter(tab => !tab.hide).find((_, index) => index == selectedTabIndex).content}
                                    </article>
                                </section>
                                </td>
                            </tr>` : html`<tr><td colspan="2">${this.translation('noresults')}</td></tr>`}                    
                    </table>` 
                : html``;
    }

    setSelectedRace(ev: SelectChangeEvent) {
        const round = parseInt(ev.target.value);
        const { properties, cardValues } = this.getParentCardValues();

        properties.selectedRound = round;

        const selectedSeason = properties.selectedSeason as number;

        Promise.all([this.resultsClient.GetResults(selectedSeason, round), 
            this.resultsClient.GetQualifyingResults(selectedSeason, round),
            this.resultsClient.GetSprintResults(selectedSeason, round),
            this.resultsClient.GetSchedule(selectedSeason)])
            .then(([results, qualifyingResults, sprintResults, schedule]) => {

                let race = results.Races[0];
                /* istanbul ignore next */
                if(race) {
                    race.QualifyingResults = qualifyingResults.Races[0].QualifyingResults;
                    /* istanbul ignore next */
                    race.SprintResults = sprintResults?.Races[0]?.SprintResults
                    properties.selectedSeason = race.season;                    
                /* istanbul ignore next */
                } else {
                    /* istanbul ignore next */
                    race = schedule.filter((item: Race) => parseInt(item.round) == round)[0];
                }

                properties.selectedRace = race;
                cardValues.set('cardValues', properties);
                this.parent.properties = cardValues;
            });
    }

    private setRaces(ev: SelectChangeEvent) {
        const selectedSeason = ev.target.value;
        const { properties, cardValues } = this.getParentCardValues();

        this.resultsClient.GetSeasonRaces(parseInt(selectedSeason)).then((response: Race[]) => {            

            properties.selectedSeason = selectedSeason;
            properties.selectedRace = undefined;
            properties.races = response;
            cardValues.set('cardValues', properties);
            this.parent.properties = cardValues;
        });
    }

    private getUpcomingRace(now: Date, races: Race[]) : Race {
        
        const nextRaces = races.filter(race =>  {

            const raceDateTime = new Date(race.date + 'T' + race.time);
            const qualifyingDateTime = new Date(race.Qualifying.date + 'T' + race.Qualifying.time);
            const sprintDateTime = race.Sprint ? new Date(race.Sprint.date + 'T' + race.Sprint.time) : null;

            if(raceDateTime >= now && (qualifyingDateTime < now && (sprintDateTime === null || sprintDateTime < now))) {
                return true;
            }

            return false;
        });

        return nextRaces.length > 0 ? nextRaces[0] : null;
    }

    private getLastResult() {

        const now = new Date();

        Promise.all([this.client.GetSchedule(now.getFullYear()), this.client.GetLastResult()])
            .then(([schedule, lastResult]) => {
            
                const upcomingRace = this.getUpcomingRace(now, schedule);

                let season : number = new Date().getFullYear();
                let round : number = upcomingRace !== null ? parseInt(upcomingRace.round) : 0;
    
                let race = { } as Race;
                if(upcomingRace !== null) {
                    race = upcomingRace;
                    round = parseInt(race.round);
                    season = parseInt(race.season);
                } else {
                    race = lastResult;
                    round = parseInt(lastResult.round);
                    season = parseInt(lastResult.season);
                }
                
                Promise.all([this.resultsClient.GetQualifyingResults(season, round), 
                            this.resultsClient.GetSprintResults(season, round),
                            this.resultsClient.GetSeasonRaces(season)])
                    .then(([qualifyingResults, sprintResults, seasonRaces]) => {
                                                
                        const { properties, cardValues } = this.getParentCardValues();

                        race.QualifyingResults = qualifyingResults.Races[0].QualifyingResults;
                        race.SprintResults = sprintResults.Races[0]?.SprintResults;
                        
                        properties.races = seasonRaces;
                        properties.selectedRace = race;
                        properties.selectedSeason = season.toString();
                        
                        cardValues.set('cardValues', properties);
                        this.parent.properties = cardValues;
                    });
        });        
    }

    setSelectedTabIndex(index: number) {        
        const { properties, cardValues } = this.getParentCardValues();
        properties.selectedTabIndex = index;
        cardValues.set('cardValues', properties);
        this.parent.properties = cardValues;
    }       

    icon(key: string) : string {

        if(!this.config.icons || Object.keys(this.config.icons).indexOf(key) < 0) {
            return this.icons[key];
        }

        return this.config.icons[key];
    }

    tabOrder(tab: string) : number {
        const tabsOrder = this.config.tabs_order?.map(tab => tab.toLowerCase()) ?? ['results', 'qualifying', 'sprint'];

        return tabsOrder.indexOf(tab);
    }
}
