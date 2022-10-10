import { HomeAssistant } from "custom-card-helpers";
import { PropertyValues } from "lit";
import { FormulaOneCardConfig } from "./types/formulaone-card-types";

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

export const checkConfig = (config: FormulaOneCardConfig) => {
    if (config.card_type === undefined) {
        throw new Error('Please define FormulaOne card type (card_type).');
    }

    if (config.sensor === undefined) {
        throw new Error('Please define FormulaOne sensor.');
    }
};

export const getCountryFlagUrl = (countryDashed: string) => {
    const exceptions = [{ countryDashed: 'USA', name: 'United-States-of-America'}];

    const exception = exceptions.filter(exception => exception.countryDashed == countryDashed);
    if(exception.length > 0)
    {
        countryDashed = exception[0].name; 
    }

    return `https://www.countries-ofthe-world.com/flags-normal/flag-of-${countryDashed}.png`;
}