import { HomeAssistant } from "custom-card-helpers";
import { HTMLTemplateResult } from "lit-html";
import FormulaOneCard from "..";
import ErgastClient from "../api/ergast-client";
import { Race } from "../api/models";
import { CardProperties, FormulaOneCardConfig, Translation } from "../types/formulaone-card-types";

export abstract class BaseCard {
    parent: FormulaOneCard;
    config: FormulaOneCardConfig;  
    client: ErgastClient;
    hass: HomeAssistant;

    constructor(parent: FormulaOneCard) {     
        this.config = parent.config;   
        this.client = new ErgastClient();
        this.hass = parent._hass;
        this.parent = parent;
    }    

    translation(key: string) : string {

        if(!this.config.translations || Object.keys(this.config.translations).indexOf(key) < 0) {
            return this.defaultTranslations[key];
        }

        return this.config.translations[key];
    }

    abstract render() : HTMLTemplateResult;

    abstract cardSize() : number;

    abstract defaultTranslations: Translation;    

    protected getProperties() {
        const cardProperties = this.parent.properties?.get('cardValues') as CardProperties;
        const races = cardProperties?.races as Race[];
        const selectedRace = cardProperties?.selectedRace as Race;
        const selectedSeason = cardProperties?.selectedSeason as string;
        const selectedTabIndex = cardProperties?.selectedTabIndex as number;
        return { races, selectedRace, selectedSeason, selectedTabIndex };
    }

    protected getParentCardValues() {
        const cardValues = this.parent.properties ?? new Map<string, unknown>();
        const properties = cardValues.get('cardValues') as CardProperties ?? {} as CardProperties;
        return { properties, cardValues };
    }
}
