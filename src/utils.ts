import { html, PropertyValues } from "lit";
import { FormulaOneCardConfig, LocalStorageItem } from "./types/formulaone-card-types";
import * as countries from './data/countries.json';
import { Driver, Root } from "./api/models";
import FormulaOneCard from ".";
import { BaseCard } from "./cards/base-card";

export const hasConfigOrCardValuesChanged = (node: FormulaOneCard, changedProps: PropertyValues) => {
    if (changedProps.has('config')) {
        return true;
    }

    const card = changedProps.get('card') as BaseCard;
    if (card) {
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

    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export const getCircuitName = (circuitName: string) => {
    const exceptions = [{ countryDashed: 'UAE', name: 'Abu_Dhabi'}, { countryDashed: 'UK', name: 'Great_Britain'}, 
    { countryDashed: 'Monaco', name: 'Monoco'}, { countryDashed: 'Azerbaijan', name: 'Baku'}];

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