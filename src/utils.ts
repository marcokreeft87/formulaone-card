import { html, HTMLTemplateResult, LitElement, PropertyValues } from "lit";
import { FormulaOneCardConfig, FormulaOneCardType, LocalStorageItem } from "./types/formulaone-card-types";
import * as countries from './data/countries.json';
import { Driver, Race, Root } from "./api/models";
import FormulaOneCard from ".";
import { BaseCard } from "./cards/base-card";
import { formatDateTimeRaceInfo } from "./lib/format_date_time";
import { ActionHandlerEvent, handleAction, hasAction, HomeAssistant } from "custom-card-helpers";
import { formatDateNumeric } from "./lib/format_date";
import { ImageConstants } from "./lib/constants";
import { actionHandler } from './directives/action-handler-directive';

export const hasConfigOrCardValuesChanged = (node: FormulaOneCard, changedProps: PropertyValues) => {
    if (changedProps.has('config')) {
        return true;
    }

    const card = changedProps.get('card') as BaseCard;
    if (card && card.parent) {
        return card.parent.properties !== node.properties;
    }

    const cardValues = changedProps.get('cardValues') as Map<string, unknown>;
    if(cardValues) {
        return cardValues != node.properties;
    }

    return false;
};

export const getCountryFlagByNationality = (nationality: string) => {
    const country = countries.filter(x => x.Nationality === nationality)[0];

    return getCountryFlagUrl(country.Code);
}

export const getCountryFlagByName = (countryName: string) => {
    const exceptions = [{ countryCode: 'USA', corrected: 'United States of America'}, { countryCode: 'UAE', corrected: 'United Arab Emirates'},
    { countryCode: 'UK', corrected: 'United Kingdom'}];

    const exception = exceptions.filter(exception => exception.countryCode == countryName);
    if(exception.length > 0)
    {
        countryName = exception[0].corrected;
    }

    const country = countries.filter(x => x.Country === countryName)[0];

    return getCountryFlagUrl(country.Code);
}

export const checkConfig = (config: FormulaOneCardConfig) => {
    if (config.card_type === undefined) {
        throw new Error('Please define FormulaOne card type (card_type).');
    }
};

export const getCountryFlagUrl = (countryCode: string) => {
    const exceptions = [{ countryCode: 'USA', corrected: 'US'}, { countryCode: 'UAE', corrected: 'AE'}];

    const exception = exceptions.filter(exception => exception.countryCode == countryCode);
    if(exception.length > 0)
    {
        countryCode = exception[0].corrected; 
    }

    return `${ImageConstants.FlagCDN}${countryCode.toLowerCase()}.png`;
}

export const getTeamImageUrl = (teamName: string) => {
    teamName = teamName.toLocaleLowerCase().replace('_', '-');
    const exceptions = [{ teamName: 'red-bull', corrected: 'red-bull-racing'}, { teamName: 'alfa', corrected: 'alfa-romeo'}, { teamName: 'haas', corrected: 'haas-f1-team'}];

    const exception = exceptions.filter(exception => exception.teamName == teamName);
    if(exception.length > 0)
    {
        teamName = exception[0].corrected;
    }

    return `${ImageConstants.TeamLogoCDN}/2023/${teamName.toLowerCase()}-logo.png.transform/2col-retina/image.png`;
}

export const getCircuitName = (circuitName: string) => {
    const exceptions = [{ countryDashed: 'UAE', name: 'Abu_Dhabi'}, { countryDashed: 'UK', name: 'Great_Britain'}, 
    { countryDashed: 'Monaco', name: 'Monoco'}, { countryDashed: 'Azerbaijan', name: 'Baku'}, { countryDashed: 'Saudi-Arabia', name: 'Saudi_Arabia'}];

    const exception = exceptions.filter(exception => exception.countryDashed == circuitName);
    if(exception.length > 0)
    {
        circuitName = exception[0].name; 
    }

    return circuitName;
}

export const getDriverName = (driver: Driver, config: FormulaOneCardConfig) => {
    const permanentNumber = driver.code == 'VER' ? 1 : driver.permanentNumber;
    return `${driver.givenName} ${driver.familyName}${(config.show_carnumber ? ` #${permanentNumber}` : '')}`;
}

export const getApiErrorMessage = (dataType: string) => {
    return html`<table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting ${dataType} <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table>`
}

export const getApiLoadingMessage = () => {
    return html`<table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table>`
}

export const getEndOfSeasonMessage = (message: string) => {
    return html`<table><tr><td class="text-center"><ha-icon icon="mdi:flag-checkered"></ha-icon><strong>${message}</strong><ha-icon icon="mdi:flag-checkered"></ha-icon></td></tr></table>`;
} 

export const clickHandler = (node: LitElement, config: FormulaOneCardConfig, hass: HomeAssistant, ev: ActionHandlerEvent) => {
    handleAction(node, hass, config.actions, ev.detail.action);
}

export const renderHeader = (card: BaseCard, race: Race): HTMLTemplateResult => {
        
    const countryDashed = race.Circuit.Location.country.replace(" ","-")
    const circuitName = getCircuitName(countryDashed);

    const _handleAction = (ev: ActionHandlerEvent): void => {
        if (card.hass && card.config.actions && ev.detail.action) {
            clickHandler(card.parent, card.config, card.hass, ev);
        }
    }
    
    const hasConfigAction = card.config.image_clickable || card.config.actions !== undefined;
    const circuitUrl = race.Circuit.url;

    if(card.config.image_clickable && !card.config.actions) {
        card.config.actions = {
            tap_action: {
                action: 'url',
                url_path: circuitUrl
            }
        };
    }

    const imageHtml = html`<img width="100%" src="${ImageConstants.F1CDN}Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png" @action=${_handleAction}
    .actionHandler=${actionHandler({
        hasHold: hasAction(card.config.actions?.hold_action),
        hasDoubleClick: hasAction(card.config.actions?.double_tap_action),
      })} class="${(hasConfigAction ? ' clickable' : null)}" />`;
    const raceName = html`<h2><img height="25" src="${getCountryFlagByName(race.Circuit.Location.country)}">&nbsp;  ${race.round} :  ${race.raceName}</h2>`;
    
    return html`${(card.config.card_type == FormulaOneCardType.Countdown  ? html`` : raceName)} ${imageHtml}<br>`;
}

export const renderRaceInfo = (hass: HomeAssistant, config: FormulaOneCardConfig, race: Race, card: BaseCard) => {
    const raceDate = new Date(race.date + 'T' + race.time);
    const freePractice1 = formatDateTimeRaceInfo(new Date(race.FirstPractice.date + 'T' + race.FirstPractice.time), hass.locale);
    const freePractice2 = formatDateTimeRaceInfo(new Date(race.SecondPractice.date + 'T' + race.SecondPractice.time), hass.locale);
    const freePractice3 = race.ThirdPractice !== undefined ? formatDateTimeRaceInfo(new Date(race.ThirdPractice.date + 'T' + race.ThirdPractice.time), hass.locale) : '-';
    const raceDateFormatted = formatDateTimeRaceInfo(raceDate, hass.locale);
    const qualifyingDate = formatDateTimeRaceInfo(new Date(race.Qualifying.date + 'T' + race.Qualifying.time), hass.locale);
    const sprintDate = race.Sprint !== undefined ? formatDateTimeRaceInfo(new Date(race.Sprint.date + 'T' + race.Sprint.time), hass.locale) : '-';
    
    return html`<tr><td>${card.translation('date')}</td><td>${formatDateNumeric(raceDate, hass.locale, config.date_locale)}</td><td>&nbsp;</td><td>${card.translation('practice1')}</td><td align="right">${freePractice1}</td></tr>
                <tr><td>${card.translation('race')}</td><td>${race.round}</td><td>&nbsp;</td><td>${card.translation('practice2')}</td><td align="right">${freePractice2}</td></tr>
                <tr><td>${card.translation('racename')}</td><td>${race.raceName}</td><td>&nbsp;</td><td>${card.translation('practice3')}</td><td align="right">${freePractice3}</td></tr>
                <tr><td>${card.translation('circuitname')}</td><td>${race.Circuit.circuitName}</td><td>&nbsp;</td><td>${card.translation('qualifying')}</td><td align="right">${qualifyingDate}</td></tr>
                <tr><td>${card.translation('location')}</td><td>${race.Circuit.Location.country}</td><td>&nbsp;</td><td>${card.translation('sprint')}</td><td align="right">${sprintDate}</td></tr>        
                <tr><td>${card.translation('city')}</td><td>${race.Circuit.Location.locality}</td><td>&nbsp;</td><td>${card.translation('racetime')}</td><td align="right">${raceDateFormatted}</td></tr>`;
}

export const getRefreshTime = (endpoint: string) => {
    let refreshCacheHours = 24;
    const now = new Date();
    const scheduleLocalStorage = localStorage.getItem(`${now.getFullYear()}.json`);

    if(scheduleLocalStorage) {
        const item: LocalStorageItem = <LocalStorageItem>JSON.parse(scheduleLocalStorage);
        const schedule = <Root>JSON.parse(item.data);
        const filteredRaces = schedule.MRData.RaceTable.Races.filter(race => new Date(race.date).toLocaleDateString == now.toLocaleDateString);
        
        if(filteredRaces.length > 0) {
            const todaysRace = filteredRaces[0];
            const raceTime = new Date(todaysRace.date + 'T' + todaysRace.time);
            
            const lastResultLocalStorage = localStorage.getItem(endpoint);  
            if(lastResultLocalStorage) {
                const resultItem: LocalStorageItem = <LocalStorageItem>JSON.parse(lastResultLocalStorage);
                
                if(new Date(resultItem.created) < raceTime) {
                    refreshCacheHours = 1;
                }
            }          
        }
    }

    return refreshCacheHours;
}