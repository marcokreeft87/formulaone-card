import { HomeAssistant } from "custom-card-helpers";
import { HTMLTemplateResult } from "lit-html";
import FormulaOneCard from "..";
import ErgastClient from "../api/ergast-client";
import { Race } from "../api/f1-models";
import ImageClient from "../api/image-client";
import WeatherClient from "../api/weather-client";
import { CardProperties, F1DataSource, FormulaOneCardConfig, Translation } from "../types/formulaone-card-types";
import { IClient } from "../api/client-base";
import F1SensorClient from "../api/f1sensor-client";

export abstract class BaseCard {
    parent: FormulaOneCard;
    config: FormulaOneCardConfig;  
    client: IClient;
    resultsClient: ErgastClient;
    hass: HomeAssistant;
    weatherClient: WeatherClient;
    imageClient: ImageClient;

    constructor(parent: FormulaOneCard) {     
        this.config = parent.config;           
        this.hass = parent._hass;
        this.client = this.config.source === F1DataSource.F1Sensor ? new F1SensorClient(this.hass, this.config.entity) : new ErgastClient();
        this.resultsClient = new ErgastClient();
        this.parent = parent;
        this.weatherClient = new WeatherClient(this.config.weather_options?.api_key ?? '');
        this.imageClient = new ImageClient();
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
        const selectedTabIndex = cardProperties?.selectedTabIndex as number ?? 0;
        return { races, selectedRace, selectedSeason, selectedTabIndex };
    }

    protected getParentCardValues() {
        const cardValues = this.parent.properties ?? new Map<string, unknown>();
        const properties = cardValues.get('cardValues') as CardProperties ?? {} as CardProperties;
        return { properties, cardValues };
    }
}
