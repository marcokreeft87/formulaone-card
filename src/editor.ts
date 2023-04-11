import { fireEvent, HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import { css, CSSResult, LitElement } from "lit";
import { html, TemplateResult } from "lit-html";
import { customElement, property, state } from 'lit/decorators.js';
import { CARD_EDITOR_NAME } from "./consts";
import { FormulaOneCardConfig, FormulaOneCardType, ValueChangedEvent } from "./types/formulaone-card-types";

@customElement(CARD_EDITOR_NAME)
export class FormulaOneCardEditor extends LitElement implements LovelaceCardEditor {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @state() private config?: FormulaOneCardConfig;

    setConfig(config: FormulaOneCardConfig): void {
        this.config = config;
    }

    get _cardType(): string {
        return this.config?.card_type || '';
    }

    get _title(): string {
        return this.config?.title || null;
    }

    get _f1_font(): boolean {
        return typeof this.config?.f1_font === 'undefined' ? false : this.config?.f1_font;
    }  
    
    get _dateLocale(): string {
        return this.config?.date_locale || null;
    }

    get _imageClickable(): boolean {
        return typeof this.config?.image_clickable === 'undefined' ? false : this.config?.image_clickable;
    }

    get _showCarnumber(): boolean {
        return typeof this.config?.show_carnumber === 'undefined' ? false : this.config?.show_carnumber;
    }

    get _locationClickable(): boolean {
        return typeof this.config?.location_clickable === 'undefined' ? false : this.config?.location_clickable;
    }

    get _previousRace(): string {
        return this.config?.previous_race || undefined;
    }

    // TODO standings options

    // TODO translations

    get _showRaceinfo(): boolean {
        return typeof this.config?.show_raceinfo === 'undefined' ? false : this.config?.show_raceinfo;
    }

    get _hideTracklayout(): boolean {
        return typeof this.config?.hide_tracklayout === 'undefined' ? false : this.config?.hide_tracklayout;
    }

    get _hideRacedatetimes(): boolean {
        return typeof this.config?.hide_racedatetimes === 'undefined' ? false : this.config?.hide_racedatetimes;
    }

    // TODO actions

    get _showWeather(): boolean {
        return typeof this.config?.show_weather === 'undefined' ? false : this.config?.show_weather;
    }

    // TODO weather options

    // TODO Countdown type

    get _rowLimit(): number {
        return this.config?.row_limit || undefined;
    }

    protected generateCheckbox(configValue: string, label: string, checked: boolean): TemplateResult {
        return html`
            <ha-formfield label=${label}>
                <ha-switch
                    .checked=${checked}
                    .configValue=${configValue}
                    @change=${this._valueChanged}
                ></ha-switch>
            </ha-formfield>
        `;
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }


        const cardTypes: {id: string; name: string}[] = [];

        for (const [key, value] of Object.entries(FormulaOneCardType)) {
            cardTypes.push({id: value, name: key});
        }

        return html`
            <div class="card-config">
                <div class="tabs">
                <div class="tab">
                    <input type="checkbox" id="entity" class="tab-checkbox">
                    <label class="tab-label" for="entity">Basic configuration</label>
                    <div class="tab-content">
                        <paper-dropdown-menu
                            label="Card Type (Required)"
                        >
                            <paper-listbox 
                            slot="dropdown-content" 
                            attr-for-selected="item-value"
                            .configValue=${'card_type'}
                            @selected-item-changed=${this._valueChangedSelect}
                            .selected=${this._cardType}
                            >
                            ${cardTypes.map((cardType) => {
                                return html`
                                <paper-item .itemValue=${cardType.id} .configValue=${'card_type'}>${cardType.name}</paper-item>
                                `;
                                })}                 
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-input
                            label="Title"
                            .value=${this._title}
                            .placeholder=${this._title}
                            .configValue=${'title'}
                            @value-changed=${this._valueChanged}
                        ></paper-input>
                        <div class="side-by-side">                            
                            ${this.generateCheckbox('f1_font', 'Use F1 font', this._f1_font)}  
                            ${this.generateCheckbox('image_clickable', 'Image clickable', this._imageClickable)}
                            ${this.generateCheckbox('show_carnumber', 'Show carnumber', this._showCarnumber)}
                            ${this.generateCheckbox('location_clickable', 'Location clickable', this._locationClickable)}
                            ${this.generateCheckbox('show_raceinfo', 'Show race information', this._showRaceinfo)}
                            ${this.generateCheckbox('hide_tracklayout', 'Hide track layout', this._hideTracklayout)}
                            ${this.generateCheckbox('hide_racedatetimes', 'Hide race dates and times', this._hideRacedatetimes)}
                            // ${this.generateCheckbox('show_weather', 'Show weather', this._showWeather)}                        
                        </div>
                    </div>
                </div>
                </div>
            </div>
            `;

    }

    // private _valueChanged(ev: CustomEvent): void {
    //     fireEvent(this, "config-changed", { config: ev.detail.value });
    // }
    private _valueChangedSelect(ev: ValueChangedEvent): void {
        console.log(ev.detail.value.parentElement.configValue);
        if (!this.config || !this.hass) {
            return;
        }
        //const 
        // if (this[`_${target.configValue}`] === target.value) {
        //     return;
        // }
        const itemValue = ev.detail.value.itemValue;
        const configValue = ev.detail.value.parentElement.configValue;
        if (configValue) {
            if (ev.detail.value.itemValue === '') {
                const tmpConfig = { ...this.config };
                delete tmpConfig[configValue];
                this.config = tmpConfig;
            } else {
                this.config = {
                    ...this.config,
                    [configValue]: itemValue,
                };
            }
        }
        fireEvent(this, 'config-changed', { config: this.config });
    }

    private _valueChanged(ev: ValueChangedEvent): void {
        if (!this.config || !this.hass) {
            return;
        }
        const target = ev.target;
        //const 
        // if (this[`_${target.configValue}`] === target.value) {
        //     return;
        // }
        if (target.configValue) {
            if (target.value === '') {
                const tmpConfig = { ...this.config };
                delete tmpConfig[target.configValue];
                this.config = tmpConfig;
            } else {
                this.config = {
                    ...this.config,
                    [target.configValue]: target.checked !== undefined ? target.checked : target.value,
                };
            }
        }
        fireEvent(this, 'config-changed', { config: this.config });
    }

    static get styles(): CSSResult {
        return css`
          ha-switch {
            padding: 16px 6px;
          }
          .side-by-side {
            display: flex;
            flex-flow: row wrap;
          }
          .side-by-side > * {
            padding-right: 8px;
            width: 50%;
            flex-flow: column wrap;
            box-sizing: border-box;
          }
          .side-by-side > *:last-child {
            flex: 1;
            padding-right: 0;
          }
          .suffix {
            margin: 0 8px;
          }
          .group {
            padding: 15px;
            border: 1px solid var(--primary-text-color)
          }
          .tabs {
            overflow: hidden;        
          }
          .tab {
            width: 100%;
            color: var(--primary-text-color);
            overflow: hidden;
          }
          .tab-label {
            display: flex;
            justify-content: space-between;
            padding: 1em 1em 1em 0em;
            border-bottom: 1px solid var(--secondary-text-color);
            font-weight: bold;
            cursor: pointer;
          }
          .tab-label:hover {
            /*background: #1a252f;*/
          }
          .tab-label::after {
            content: "❯";
            width: 1em;
            height: 1em;
            text-align: center;
            transition: all 0.35s;
          }
          .tab-content {
            max-height: 0;
            padding: 0 1em;
            background: var(--secondary-background-color);
            transition: all 0.35s;
          }
          input.tab-checkbox {
            position: absolute;
            opacity: 0;
            z-index: -1;
          }      
          input.tab-checkbox:checked + .tab-label {
            border-color: var(--accent-color);
          }
          input.tab-checkbox:checked + .tab-label::after {
            transform: rotate(90deg);
          }
          input.tab-checkbox:checked ~ .tab-content {
            max-height: 100vh;
            padding: 1em;
          }      
        `;
      
    }
}