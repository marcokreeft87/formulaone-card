import { ActionConfig, ActionHandlerOptions, HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';

export interface FormulaOneCardConfig extends LovelaceCardConfig {    
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
    actions?: ActionOptions;
    f1_font?: boolean;
}

export interface ActionOptions {
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
}

export interface Translation {
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