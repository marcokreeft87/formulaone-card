import { HomeAssistant } from "custom-card-helpers";
import { HTMLTemplateResult } from "lit-html";
import FormulaOneCard from "..";
import { IClient } from "../api/client-base";
import JolpiClient from "../api/ergast-client";
import { Race } from "../api/f1-models";
import F1SensorClient from "../api/f1sensor-client";
import ImageClient from "../api/image-client";
import VCWeatherClient from "../api/vc-weather-client";
import { IWeatherClient } from "../api/weather-models";
import { CardProperties, F1DataSource, FormulaOneCardConfig, Translation } from "../types/formulaone-card-types";

export abstract class BaseCard {
    parent: FormulaOneCard;
    config: FormulaOneCardConfig;  
    client: IClient;
    resultsClient: JolpiClient;
    hass: HomeAssistant;
    weatherClient: IWeatherClient;
    imageClient: ImageClient;

    constructor(parent: FormulaOneCard) {     
        this.config = parent.config;           
        this.hass = parent._hass;
        this.client = this.config.source === F1DataSource.F1Sensor ? new F1SensorClient(this.hass, this.config.entity, this.config.last_race_results_entity) : new JolpiClient();
        this.resultsClient = new JolpiClient();
        this.parent = parent;
        this.weatherClient = this.config.weather_options?.source ? new F1SensorClient(this.hass, this.config.entity, this.config.last_race_results_entity) : new VCWeatherClient(this.config.weather_options?.api_key ?? '');
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
