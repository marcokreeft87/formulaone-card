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