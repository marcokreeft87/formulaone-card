import { HomeAssistant } from 'custom-card-helpers';
import { ClientBase, IClient } from './client-base';
import { ConstructorStanding, DriverStanding, Race, RaceTable, Season } from './f1-models';

export default class F1SensorClient extends ClientBase implements IClient {
    baseUrl: string;
    hass: HomeAssistant;
    entity: string;

    constructor(hass: HomeAssistant, entity: string) {
        super();  
        
        this.hass = hass;
        this.entity = entity;
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
    GetSprintResults(season: number, round: number): Promise<RaceTable> {
        throw new Error('Method not implemented.');
    }
    GetQualifyingResults(season: number, round: number): Promise<RaceTable> {
        throw new Error('Method not implemented.');
    }
    GetResults(season: number, round: number): Promise<RaceTable> {
        throw new Error('Method not implemented.');
    }
    GetSeasons(): Promise<Season[]> {
        throw new Error('Method not implemented.');
    }
    GetSeasonRaces(season: number): Promise<Race[]> {
        throw new Error('Method not implemented.');
    }
    GetLastYearsResults(circuitName: string): Promise<Race> {
        throw new Error('Method not implemented.');
    }   
    RefreshCache(): void {
        throw new Error('Method not implemented.');
    }
}