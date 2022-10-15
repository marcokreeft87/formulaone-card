import { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';

export interface FormulaOneCardConfig extends LovelaceCardConfig {    
    show_icon?: boolean;
    title?: string;
    name?: string;
    hass?: HomeAssistant;
    card_type?: FormulaOneCardType;
    sensor?: string;
    date_locale?: string;
    image_clickable?: boolean;
    show_carnumber?: boolean;
    location_clickable?: boolean;
    previous_race?: PreviousRaceDisplay;
}

export enum PreviousRaceDisplay {
    Strikethrough = 'strikethrough',
    Italic = 'italic',
    Hide = 'hide'
}

export interface FormulaOneSensor {
    last_update: Date
    data: Race[] | ConstructorStanding[] | DriverStanding[] | Race
}

export enum FormulaOneCardType {
    DriverStandings = 'driver_standings',
    ConstructorStandings = 'constructor_standings',
    NextRace = 'next_race',
    Schedule = 'schedule',
    LastResult = 'last_result'
}

export interface Location {
    lat: string;
    long: string;
    locality: string;
    country: string;
}

export interface Circuit {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: Location;
}

export interface FirstPractice {
    date: string;
    time: string;
}

export interface SecondPractice {
    date: string;
    time: string;
}

export interface ThirdPractice {
    date: string;
    time: string;
}

export interface Qualifying {
    date: string;
    time: string;
}

export interface Sprint {
    date: string;
    time: string;
}

export interface Race {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    FirstPractice: FirstPractice;
    SecondPractice: SecondPractice;
    ThirdPractice: ThirdPractice;
    Qualifying?: Qualifying;
    Sprint?: Sprint;
    Results?: Result[]
}

export interface Time {
    millis: string;
    time: string;
}

export interface Time2 {
    time: string;
}

export interface AverageSpeed {
    units: string;
    speed: string;
}

export interface FastestLap {
    rank: string;
    lap: string;
    Time: Time2;
    AverageSpeed: AverageSpeed;
}

export interface Result {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    grid: string;
    laps: string;
    status: string;
    Time: Time;
    FastestLap: FastestLap;
}

export interface RaceTable {
    season: string;
    Races: Race[];
}

export interface Constructor {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
}

export interface Driver {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
}

export interface ConstructorStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: Constructor;
}

export interface StandingsList {
    season: string;
    round: string;
    ConstructorStandings: ConstructorStanding[];
    DriverStandings: DriverStanding[];
}

export interface DriverStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Driver: Driver;
    Constructors: Constructor[];
}

export interface StandingsTable {
    season: string;
    StandingsLists: StandingsList[];
}
