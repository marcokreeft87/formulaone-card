import { WeatherOptions } from "../types/formulaone-card-types";
import { Race } from "./f1-models";

export interface IWeatherClient {
    getRaceWeatherData(options: WeatherOptions, race: Race) : Promise<WeatherData>; 
}

export interface WeatherData {
    race_temperature: number;
    race_temperature_unit: string;
    race_feelslike: number;
    race_feelslike_unit: string;
    race_humidity: number;
    race_humidity_unit: string;
    race_cloud_cover: number;
    race_cloud_cover_unit: string;
    race_precipitation: number;
    race_precipitation_prob: number;
    race_precipitation_unit: string;
    race_wind_speed: number;
    race_wind_speed_unit: string;
    race_wind_direction: string;
    race_wind_from_direction_degrees: number;
    race_wind_from_direction_unit: string;
    icon: string;
    friendly_name: string;
  }
  

export interface Hour {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    dew: number;
    precip: number;
    precipprob: number;
    snow: number;
    snowdepth: number;
    preciptype: string[];
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    solarradiation: number;
    solarenergy?: number;
    uvindex: number;
    severerisk: number;
    conditions: string;
    icon: string;
    stations: string[];
    source: string;
    sunrise: string;
    sunriseEpoch?: number;
    sunset: string;
    sunsetEpoch?: number;
    moonphase?: number;
}

export interface Day {
    datetime: string;
    datetimeEpoch: number;
    tempmax: number;
    tempmin: number;
    temp: number;
    feelslikemax: number;
    feelslikemin: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: number;
    precipcover: number;
    preciptype: string[];
    snow: number;
    snowdepth: number;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    visibility: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    severerisk: number;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
    conditions: string;
    description: string;
    icon: string;
    stations: string[];
    source: string;
    hours: Hour[];
}

export interface CurrentConditions {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    dew: number;
    precip: number;
    precipprob: number;
    snow: number;
    snowdepth: number;
    //preciptype?: any;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    solarradiation: number;
    //solarenergy?: any;
    uvindex: number;
    severerisk: number;
    conditions: string;
    icon: string;
    //stations: any[];
    source: string;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
}

export interface WeatherResponse {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    description: string;
    days: Day[];
    //alerts: any[];
    currentConditions: CurrentConditions;
}