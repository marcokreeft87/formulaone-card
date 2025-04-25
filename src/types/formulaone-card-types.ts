import { ActionConfig, ActionHandlerOptions, HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
import { HTMLTemplateResult } from 'lit-element';

export interface FormulaOneCardConfig extends LovelaceCardConfig {
    source: F1DataSource;
    entity?: string;
    show_icon?: boolean;
    title?: string;
    name?: string;
    hass?: HomeAssistant;
    card_type?: FormulaOneCardType;
    date_locale?: string;
    image_clickable?: boolean;
    show_carnumber?: boolean;
    location_clickable?: boolean;
    previous_race?: PreviousRaceDisplay;
    standings?: StandingDisplayOptions;
    translations?: Translation;
    show_raceinfo?: boolean;
    hide_tracklayout?: boolean;
    hide_racedatetimes?: boolean;
    actions?: ActionOptions;
    f1_font?: boolean; 
    row_limit?: number;
    icons?: CustomIcons;
    countdown_type?: CountdownType | CountdownType[] | undefined;
    show_weather?: boolean;
    weather_options?: WeatherOptions;
    next_race_delay?: number;
    show_lastyears_result?: boolean;
    only_show_date?: boolean;
    tabs_order?: string[];
    show_refresh?: boolean;
    next_race_display?: NextRaceDisplay | undefined;
}

export enum F1DataSource {
    Jolpi = 'jolpi',
    F1Sensor = 'f1sensor'
}

export interface ValueChangedEvent {
    detail: {
        value: {
            itemValue: string;
            parentElement: {
                configValue: string;
            };
        }
    };
    target: {
        value: string;
        configValue: string;
        checked?: boolean;
    };    
}

export interface WeatherOptions {
    source: WeatherSource;
    entity?: string;
    api_key?: string;
    unit?: WeatherUnit;
    show_icon?: boolean;
    show_precipitation?: boolean; 
    show_wind?: boolean;
    show_temperature?: boolean;
    show_cloud_cover?: boolean;
    show_visibility?: boolean;
}

export enum WeatherSource {
    VisualCrossing = 'visualcrossing',
    F1Sensor = 'f1sensor',
}

export enum NextRaceDisplay {
    DateOnly = 'date',
    TimeOnly = 'time',
    DateAndTime = 'datetime'
}

export enum WeatherUnit {
    Metric = 'metric',
    MilesCelsius = 'uk',
    MilesFahrenheit = 'us'
}

export enum CountdownType {
    Race = "race",
    Qualifying = "qualifying",
    Practice1 = "practice1",
    Practice2 = "practice2",
    Practice3 = "practice3",
    Sprint = "sprint",
    SprintQualifying = "sprint_qualifying"
}

export interface ActionOptions {
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
}

export interface Translation {
    [key: string]: string;
}

export interface CustomIcons {
    [key: string]: string;
}

export interface StandingDisplayOptions {
    show_team?: boolean;
    show_flag?: boolean;
    show_teamlogo?: boolean;
}

export enum PreviousRaceDisplay {
    Strikethrough = 'strikethrough',
    Italic = 'italic',
    Hide = 'hide'
}

export enum FormulaOneCardType {
    DriverStandings = 'driver_standings',
    ConstructorStandings = 'constructor_standings',
    NextRace = 'next_race',
    Schedule = 'schedule',
    LastResult = 'last_result',
    Results = 'results',
    Countdown = 'countdown'
}

export interface LocalStorageItem {
    data: string,
    created: Date
}

export interface CardProperties {
    [key: string]: unknown;
}

export interface ActionHandler extends HTMLElement {
    holdTime: number;
    bind(element: Element, options: ActionHandlerOptions): void;
}

export interface ActionHandlerElement extends HTMLElement {
    actionHandler?: boolean;
}

export interface FormulaOneCardTab {
    title: string
    icon: string
    content: HTMLTemplateResult,
    hide?: boolean,
    order?: number
}

export interface SelectChangeEvent {
    target: {
        value: string;
    }
}

export interface mwcTabBarEvent extends Event {
    detail: {
        index: number;
    };
}