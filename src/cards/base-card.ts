import { HomeAssistant } from "custom-card-helpers";
import { HTMLTemplateResult } from "lit-html";
import FormulaOneCard from "..";
import ErgastClient from "../api/ergast-client";
import { FormulaOneCardConfig, Translation } from "../types/formulaone-card-types";

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
}
