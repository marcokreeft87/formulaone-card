import { HTMLTemplateResult } from "lit-html";
import ErgastClient from "../api/ergast-client";
import { FormulaOneCardConfig, Translation } from "../types/formulaone-card-types";

export abstract class BaseCard {
    setValues(values: Map<string, unknown>) {
        throw new Error('Method not implemented.');
    }
    config: FormulaOneCardConfig;  
    client: ErgastClient;

    constructor(config: FormulaOneCardConfig) {     
        this.config = config;   
        this.client = new ErgastClient();
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
