import { HomeAssistant } from "custom-card-helpers";
import { PropertyValues } from "lit";
import { Driver, FormulaOneCardConfig } from "./types/formulaone-card-types";
import * as countries from './data/countries.json';

export const hasConfigOrEntitiesChanged = (node: FormulaOneCardConfig, changedProps: PropertyValues) => {
    if (changedProps.has('config')) {
        return true;
    }

    const oldHass = changedProps.get('_hass') as HomeAssistant;
    if (oldHass) {
        return oldHass.states[node.sensor] !== node.hass.states[node.sensor];
    }
    return false;
};

export const getCountryFlagByNationality = (nationality: string) => {
    const country = countries.filter(x => x.Nationality === nationality)[0];

    return getCountryFlagUrl(country.Code);
}

export const getCountryFlagByName = (countryName: string) => {
    const exceptions = [{ countryCode: 'USA', corrected: 'United States of America'}, { countryCode: 'UAE', corrected: 'United Arab Emirates'}];

    const exception = exceptions.filter(exception => exception.countryCode == countryName);
    if(exception.length > 0)
    {
        countryName = exception[0].corrected;
    }

    const country = countries.filter(x => x.Country === countryName)[0];
    if(country == undefined) {
        throw new Error(`${countryName} not found`);
    }

    return getCountryFlagUrl(country.Code);
}

export const checkConfig = (config: FormulaOneCardConfig) => {
    if (config.card_type === undefined) {
        throw new Error('Please define FormulaOne card type (card_type).');
    }

    if (config.sensor === undefined) {
        throw new Error('Please define FormulaOne sensor.');
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
    const exceptions = [{ countryDashed: 'UAE', name: 'Abu_Dhabi'}];

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