import * as packageJson from '../package.json';
import { property, customElement } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { FormulaOneCardConfig, FormulaOneCardType } from './types/formulaone-card-types';
import { CSSResult, html, HTMLTemplateResult, LitElement, PropertyValues } from 'lit';
import { checkConfig, hasConfigOrCardValuesChanged } from './utils';
import { loadCustomFonts } from './fonts';
import { styles } from './styles';
import ConstructorStandings from './cards/constructor-standings';
import DriverStandings from './cards/driver-standings';
import Schedule from './cards/schedule';
import NextRace from './cards/next-race';
import LastResult from './cards/last-result';
import { BaseCard } from './cards/base-card';
import Countdown from './cards/countdown';
import Results from './cards/results';
import QualifyingResults from './cards/qualifying-results';

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
  description: 'Present the data of Formula One in a pretty way',
});
/* eslint-enable @typescript-eslint/no-explicit-any */

@customElement('formulaone-card')
export default class FormulaOneCard extends LitElement {
    @property() _hass?: HomeAssistant;
    @property() config?: FormulaOneCardConfig;
    @property() card: BaseCard;
    @property() set properties(values: Map<string, unknown>) {
        this._cardValues = values;
        this.update(values);
    }
    get properties() {
        return this._cardValues;
    }

    private _cardValues?: Map<string, unknown>;

    setConfig(config: FormulaOneCardConfig) {

        checkConfig(config);

        this.config = { ...config };
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        return hasConfigOrCardValuesChanged(this, changedProps);
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;

        this.config.hass = hass;

        switch(this.config.card_type) {
            case FormulaOneCardType.ConstructorStandings:
                this.card = new ConstructorStandings(this);
                break;
            case FormulaOneCardType.DriverStandings:
                this.card = new DriverStandings(this);
                break;
            case FormulaOneCardType.Schedule:
                this.card = new Schedule(this);
                break;
            case FormulaOneCardType.NextRace:
                this.card = new NextRace(this);
                break;
            case FormulaOneCardType.LastResult:
                this.card = new LastResult(this);
                break;
            case FormulaOneCardType.Countdown:
                this.card = new Countdown(this);
                break;
            case FormulaOneCardType.Results:
                this.card = new Results(this);
                break;
            case FormulaOneCardType.QualifyingResults:
                this.card = new QualifyingResults(this);
                break;
        }
    }

    static get styles(): CSSResult {
        loadCustomFonts();
        return styles;
    }

    render() : HTMLTemplateResult {
        if (!this._hass || !this.config) return html``;

        try {
            return html`
                <ha-card elevation="2">
                    ${this.config.title ? html`<h1 class="card-header${(this.config.f1_font ? ' formulaone-font' : '')}">${this.config.title}</h1>` : ''}
                    ${this.card.render()}
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