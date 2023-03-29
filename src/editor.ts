import { fireEvent, HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import { LitElement } from "lit";
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

    get _name(): string {
        return this.config?.card_type || '';
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }


        const cardTypes: {id: string; name: string}[] = [];

        for (const [key, value] of Object.entries(FormulaOneCardType)) {
            cardTypes.push({id: value, name: key});
        }

        // example : https://github.com/custom-cards/slider-button-card/blob/main/src/editor.ts
        return html`
                <paper-dropdown-menu
                  label="Card Type (Required)"
                >
                  <paper-listbox 
                    slot="dropdown-content" 
                    attr-for-selected="item-value"
                    .configValue=${'card_type'}
                    @selected-item-changed=${this._valueChangedSelect}
                    .selected=${this._name}
                  >
                  ${cardTypes.map((cardType) => {
                      return html`
                        <paper-item .itemValue=${cardType.id} .configValue=${'card_type'}>${cardType.name}</paper-item>
                      `;
                      })}                 
                  </paper-listbox>
                </paper-dropdown-menu>         
                `;


// <!-- <mwc-select
//                 naturalMenuWidth
//                 fixedMenuPosition
//                 label="Card Type (Required)"
//                 .configValue=${'card_type'}
//                 .value=${this._name}
//                 @selected=${this._valueChanged}
//                 @closed=${(ev: Event) => ev.stopPropagation()}>
//                 ${Object.keys(FormulaOneCardType).map((card_type) => {
//                 return html`<mwc-list-item .value=${card_type}>${card_type}</mwc-list-item>`;
//             })}
//             </mwc-select> -->

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
}