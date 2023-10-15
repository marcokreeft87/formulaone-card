import { css } from "lit";
import { html, TemplateResult } from "lit-html";
import { customElement } from 'lit/decorators.js';
import { CARD_EDITOR_NAME } from "./consts";
import { CountdownType, FormulaOneCardType, PreviousRaceDisplay, WeatherUnit } from "./types/formulaone-card-types";
import EditorForm from '@marcokreeft/ha-editor-formbuilder'
import { FormControlType } from "@marcokreeft/ha-editor-formbuilder/dist/interfaces";
import { getDropdownOptionsFromEnum } from "@marcokreeft/ha-editor-formbuilder/dist/utils/entities";

@customElement(CARD_EDITOR_NAME)
export class FormulaOneCardEditor extends EditorForm {

    protected render(): TemplateResult {
        if (!this._hass || !this._config) {
            return html``;
        }

        return this.renderForm([
            { controls: [{ label: "Card Type (Required)", configValue: "card_type", type: FormControlType.Dropdown, items: getDropdownOptionsFromEnum(FormulaOneCardType) }] },
            { controls: [{ label: "Title", configValue: "title", type: FormControlType.Textbox }] },
            {
                label: "Basic configuration",
                cssClass: 'side-by-side',
                controls: [
                    { label: "Use F1 font", configValue: "f1_font", type: FormControlType.Switch },
                    { label: "Image clickable", configValue: "image_clickable", type: FormControlType.Switch },
                    { label: "Show carnumber", configValue: "show_carnumber", type: FormControlType.Switch },
                    { label: "Location clickable", configValue: "location_clickable", type: FormControlType.Switch },
                    { label: "Show race information", configValue: "show_raceinfo", type: FormControlType.Switch },
                    { label: "Hide track layout", configValue: "hide_tracklayout", type: FormControlType.Switch },
                    { label: "Hide race dates and times", configValue: "hide_racedatetimes", type: FormControlType.Switch },
                    { label: "Show last years result", configValue: "show_lastyears_result", type: FormControlType.Switch },
                    { label: "Only show date", configValue: "only_show_date", type: FormControlType.Switch },
                    { type: FormControlType.Filler },
                    { label: "Row limit", configValue: "row_limit", type: FormControlType.Textbox },
                    { label: "Date locale", configValue: "date_locale", type: FormControlType.Textbox }
                ]
            },
            {
                label: "Countdown Type",
                hidden: this._config.card_type !== FormulaOneCardType.Countdown,
                cssClass: 'side-by-side',
                controls: [{ configValue: "countdown_type", type: FormControlType.Checkboxes, items: getDropdownOptionsFromEnum(CountdownType) }]
            },
            {
                hidden: this._config.card_type !== FormulaOneCardType.NextRace,
                controls: [
                    { label: "Next race delay", configValue: "next_race_delay", type: FormControlType.Textbox },
                ]
            },
            {
                hidden: this._config.card_type !== FormulaOneCardType.Schedule,
                controls: [{ label: "Previous race", configValue: "previous_race", type: FormControlType.Dropdown, items: getDropdownOptionsFromEnum(PreviousRaceDisplay) }]
            },
            {
                label: "Standings",
                hidden: this._config.card_type !== FormulaOneCardType.ConstructorStandings && this._config.card_type !== FormulaOneCardType.DriverStandings,
                cssClass: 'side-by-side',
                controls: [
                    { label: "Show team", configValue: "standings.show_team", type: FormControlType.Switch },
                    { label: "Show flag", configValue: "standings.show_flag", type: FormControlType.Switch },
                    { label: "Show teamlogo", configValue: "standings.show_teamlogo", type: FormControlType.Switch }
                ]
            },
            {
                label: "Weather",
                hidden: this._config.card_type !== FormulaOneCardType.NextRace && this._config.card_type !== FormulaOneCardType.Countdown,
                controls: [
                    { label: "Show weather", configValue: "show_weather", type: FormControlType.Switch }
                ]
            },
            {
                cssClass: 'side-by-side',
                hidden: (this._config.card_type !== FormulaOneCardType.NextRace && this._config.card_type !== FormulaOneCardType.Countdown) || !this._config.show_weather,
                controls: [
                    { label: "API key", configValue: "weather_options.api_key", type: FormControlType.Textbox },
                    { label: "Unit", configValue: "weather_options.unit", type: FormControlType.Dropdown, items: getDropdownOptionsFromEnum(WeatherUnit) },
                    { label: "Show icon", configValue: "weather_options.show_icon", type: FormControlType.Switch },
                    { label: "Show precipitation", configValue: "weather_options.show_precipitation", type: FormControlType.Switch },
                    { label: "Show wind", configValue: "weather_options.show_wind", type: FormControlType.Switch },
                    { label: "Show temperature", configValue: "weather_options.show_temperature", type: FormControlType.Switch },
                    { label: "Show cloud coverage", configValue: "weather_options.show_cloud_cover", type: FormControlType.Switch },
                    { label: "Show visibility", configValue: "weather_options.show_visibility", type: FormControlType.Switch }
                ]
            },
            {
                label: "Tabs",
                hidden: this._config.card_type !== FormulaOneCardType.Results,
                controls: [
                    { label: "Tabs order", configValue: "tabs_order", type: FormControlType.Textbox }
                ]
            },
        ]);
    }

    static get styles() {
        return css`
            .form-row {
                margin-bottom: 10px;
            }
            .form-control {
                display: flex;
                align-items: center;
            }
            ha-switch {
                padding: 16px 6px;
            }
            .side-by-side {
                display: flex;
                flex-flow: row wrap;
            }            
            .side-by-side > label {
                width: 100%;
            }
            .side-by-side > .form-control {
                width: 49%;
                padding: 2px;
            }
            ha-textfield { 
                width: 100%;
            }
            .hidden {
                display: none;
            }
            @media (max-width: 600px) {
                .side-by-side > .form-control {
                    width: 48%;
                }
            }
        `;
    }
}