import { ActionConfig, ActionHandlerOptions, HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
import { HTMLTemplateResult } from 'lit';

export interface FormulaOneCardConfig extends LovelaceCardConfig {
    show_icon?: boolean;
    title?: string;//x
    name?: string;//x
    hass?: HomeAssistant;//x
    card_type?: FormulaOneCardType;//x
    date_locale?: string;//x
    image_clickable?: boolean;//x
    show_carnumber?: boolean;//x
    location_clickable?: boolean;//x
    previous_race?: PreviousRaceDisplay;//x
    standings?: StandingDisplayOptions;//x
    translations?: Translation;
    show_raceinfo?: boolean;//x
    hide_tracklayout?: boolean;//x
    hide_racedatetimes?: boolean;//x
    actions?: ActionOptions;
    f1_font?: boolean; //x
    row_limit?: number;//x
    icons?: CustomIcons;
    countdown_type?: CountdownType | CountdownType[] | undefined;//x
    show_weather?: boolean;//x
    weather_options?: WeatherOptions;//x
    next_race_delay?: number;//x
    show_lastyears_result?: boolean;//x
    only_show_date?: boolean;//x
    tabs_order?: string[];//x
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
    api_key?: string;
    unit?: WeatherUnit;
    show_icon?: boolean;
    show_precipitation?: boolean; 
    show_wind?: boolean;
    show_temperature?: boolean;
    show_cloud_cover?: boolean;
    show_visibility?: boolean;
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
    Sprint = "sprint"
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