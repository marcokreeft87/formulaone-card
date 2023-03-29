import { fireEvent, HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import { LitElement } from "lit";
import { html, TemplateResult } from "lit-html";
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
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

        return html`

                <paper-dropdown-menu
                  label="Test"
                >
                  <paper-listbox 
                    slot="dropdown-content" 
                    attr-for-selected="item-value"
                    .configValue=${'slider.direction'}
                    @selected-item-changed=${this._valueChanged}
                    .selected=${this._name}
                  >
                  <paper-item .itemValue="0">0</paper-item>
                  <paper-item .itemValue="0">0</paper-item>
                  <paper-item .itemValue="0">0</paper-item>
                  <paper-item .itemValue="0">0</paper-item>
                  <paper-item .itemValue="0">0</paper-item>
                 
                  </paper-listbox>
                </paper-dropdown-menu>

         <mwc-select label="filled" fixed-menu-position fixedMenuPosition>
            <mwc-list-item></mwc-list-item>
            <mwc-list-item value="0">Item 0</mwc-list-item>
            <mwc-list-item value="1">Item 1</mwc-list-item>
            <mwc-list-item value="2">Item 2</mwc-list-item>
            <mwc-list-item value="3">Item 3</mwc-list-item>
        </mwc-select>           
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
    private _valueChanged(ev: ValueChangedEvent): void {
        if (!this.config || !this.hass) {
            return;
        }
        const target = ev.target;
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