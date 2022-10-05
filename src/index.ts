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

    setConfig(config: FormulaOneCardConfig) {      
        
        checkConfig(config);
        
        this.config = { ...config };
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        return hasConfigOrEntitiesChanged(this.config, changedProps);
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;

        this.config.hass = hass;
    }

    static get styles(): CSSResult {
        return style;
    }

    renderCardType(): HTMLTemplateResult {
        switch(this.config.card_type) {
            case FormulaOneCardType.ConstructorStandings:
                return new ConstructorStandings(this.config.sensor, this._hass).render();
            case FormulaOneCardType.DriverStandings:                
                return new DriverStandings(this.config.sensor, this._hass).render();
            case FormulaOneCardType.Schedule:                
                return new Schedule(this.config.sensor, this._hass, this.config).render();
            case FormulaOneCardType.NextRace:                
                return new NextRace(this.config.sensor, this._hass, this.config).render();     
            case FormulaOneCardType.LastResult:                
                return new LastResult(this.config.sensor, this._hass).render();
        }
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
}