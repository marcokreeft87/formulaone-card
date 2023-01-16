import * as packageJson from '../package.json';
import { property, customElement } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { FormulaOneCardConfig, FormulaOneCardType } from './types/formulaone-card-types';
import { CSSResult, html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { checkConfig, hasConfigOrEntitiesChanged } from './utils';
import { style } from './styles';
import ConstructorStandings from './cards/constructor-standings';
import DriverStandings from './cards/driver-standings';
import Schedule from './cards/schedule';
import NextRace from './cards/next-race';
import LastResult from './cards/last-result';
import { BaseCard } from './cards/base-card';
//import Countdown from './cards/countdown';
import Results from './cards/results';

console.info(
    `%c FORMULAONE-CARD %c ${packageJson.version}`,
    'color: cyan; background: black; font-weight: bold;',
    'color: darkblue; background: white; font-weight: bold;'
);

/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'formulaone-card',
  name: 'FormulaOne card',
  preview: false,
  description: 'Present the data of hass-formulaoneapi in a pretty way',
});
/* eslint-enable @typescript-eslint/no-explicit-any */

@customElement('formulaone-card')
export default class FormulaOneCard extends LitElement {
    @property() _hass?: HomeAssistant;
    @property() config?: FormulaOneCardConfig;
    @property() card: BaseCard;
    @property() set cardValues(values: Map<string, unknown>) {
        const oldValue = this._cardValues
        this._cardValues = values;
        //this.update(values);
        this.requestUpdate("cardValues", oldValue);
    }
    get cardValues() {
        return this._cardValues;
    }
    
    private _cardValues: Map<string, unknown>;

    requestUpdate(name?: PropertyKey, oldValue?: unknown) {
        // schedule an update
        return super.requestUpdate(name, oldValue);
      }

    update(changedProperties: Map<string, unknown>) {
        if (changedProperties.has("races")) {
        //   const oldValue = changedProperties.get("userId") as number;
            const newValue = this.cardValues;
            this.card?.setValues(newValue);
        }
        super.update(changedProperties);
      }

    setConfig(config: FormulaOneCardConfig) {      
        
        checkConfig(config);
        
        this.config = { ...config };
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        return hasConfigOrEntitiesChanged(this, changedProps);
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;

        this.config.hass = hass;

        switch(this.config.card_type) {
            case FormulaOneCardType.ConstructorStandings:
                this.card = new ConstructorStandings(this.config);
                break;
            case FormulaOneCardType.DriverStandings:                
                this.card = new DriverStandings(this.config);
                break;
            case FormulaOneCardType.Schedule:                
                this.card = new Schedule(this._hass, this.config);
                break;
            case FormulaOneCardType.NextRace:                
                this.card = new NextRace(this._hass, this.config); 
                break;    
            case FormulaOneCardType.LastResult:                
                this.card = new LastResult(this.config);
                break;
            // case FormulaOneCardType.Countdown:                
            //     this.card = new Countdown(this._hass, this.config);
            //     break;
            case FormulaOneCardType.Results:                
                this.card = new Results(this.config, this);
                break;
        }
    }

    static get styles(): CSSResult {
        return style;
    }

    renderCardType(): HTMLTemplateResult {
        

        return this.card.render();
    }

    render() : HTMLTemplateResult {
        if (!this._hass || !this.config) return html``;

        try {
            return html`
                <ha-card elevation="2">
                    ${this.config.title ? html`<h1 class="card-header">${this.config.title}</h1>` : ''}
                    ${this.renderCardType()}
                </ha-card>
            `;
        } catch (error) {
            return html`<hui-warning>${error.toString()}</hui-warning>`;
        }
    }

    getCardSize() {
        return this.card.cardSize();
    }
}