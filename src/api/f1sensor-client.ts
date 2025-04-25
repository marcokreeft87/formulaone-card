import { HomeAssistant } from 'custom-card-helpers';
import { ClientBase, IClient } from './client-base';
import { ConstructorStanding, DriverStanding, Race, RaceTable, Season } from './f1-models';
import { IWeatherClient, WeatherData } from './weather-models';
import { WeatherOptions } from '../types/formulaone-card-types';

export default class F1SensorClient extends ClientBase implements IClient, IWeatherClient {
    baseUrl: string;
    hass: HomeAssistant;
    entity: string;

    constructor(hass: HomeAssistant, entity: string) {
        super();  
        
        this.hass = hass;
        this.entity = entity;
    } 

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getRaceWeatherData(options: WeatherOptions, race: Race) : Promise<WeatherData> {
        const attributes = this.hass.states[options.entity]?.attributes;
        if (!attributes) {
            throw new Error('Weather data not found for the specified entity.');
        }

        return attributes as WeatherData;
    }

    async GetConstructorStandings() : Promise<ConstructorStanding[]> {   
        return this.hass.states[this.entity]?.attributes?.constructor_standings ?? [];
    }
    
    async GetDriverStandings(): Promise<DriverStanding[]> {
        return this.hass.states[this.entity]?.attributes?.driver_standings ?? [];
    }
    
    async GetSchedule(season: number): Promise<Race[]> {
        const data = this.hass.states[this.entity]?.attributes;

        if (season !== parseFloat(data?.season)) 
            throw new Error('This entity is only valid for the current season. Please use source: jolpi for other seasons.');

        return data?.races ?? [];   
    }

    GetLastResult(): Promise<Race> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GetSprintResults(season: number, round: number): Promise<RaceTable> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GetQualifyingResults(season: number, round: number): Promise<RaceTable> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GetResults(season: number, round: number): Promise<RaceTable> {
        throw new Error('Method not implemented.');
    }
    GetSeasons(): Promise<Season[]> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GetSeasonRaces(season: number): Promise<Race[]> {
        throw new Error('Method not implemented.');
    }
    RefreshCache(): void {
        throw new Error('Method not implemented.');
    }
}