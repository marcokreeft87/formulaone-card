import { HomeAssistant } from "custom-card-helpers";
import {  HTMLTemplateResult } from "lit-html";
import { FormulaOneCardConfig, FormulaOneSensor } from "../types/formulaone-card-types";

export abstract class BaseCard {

    sensor: FormulaOneSensor;
    sensor_entity_id: string;
    hass: HomeAssistant;
    config: FormulaOneCardConfig;

    constructor(sensor: string, hass: HomeAssistant, config: FormulaOneCardConfig) {
        this.sensor_entity_id = sensor;
        this.hass = hass;
        this.config = config;

        this.sensor = this.getSensor();
    }    

    getSensor() : FormulaOneSensor {
        const sensorEntity = this.hass.states[this.sensor_entity_id];
        return { last_update: new Date(sensorEntity.attributes['last_update']), data: sensorEntity.attributes['data']  }
    }

    abstract render() : HTMLTemplateResult;
}
