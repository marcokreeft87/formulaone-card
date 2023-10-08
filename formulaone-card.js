/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 8455:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const custom_card_helpers_1 = __webpack_require__(6197);
const lit_element_1 = __webpack_require__(936);
const interfaces_1 = __webpack_require__(7399);
class EditorForm extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.formatList = (entity, hass) => ({
            label: hass.states[entity].attributes.friendly_name,
            value: entity
        });
        this.renderTextbox = (label, configValue) => {
            var _a;
            return (0, lit_element_1.html) `
        <div class="form-control">
            <ha-textfield
                label="${label}"
                .value="${(_a = this._config[configValue]) !== null && _a !== void 0 ? _a : ''}"
                .configValue="${configValue}"
                @change="${this._valueChanged}">
            </ha-textfield>
        </div>
        `;
        };
        this.renderSwitch = (label, configValue) => {
            return (0, lit_element_1.html) `
        <div class="form-control">
            <ha-switch
                id="${configValue}"
                name="${configValue}"
                .checked="${this._config[configValue]}"
                .configValue="${configValue}"
                @change="${this._valueChanged}"
            >
            </ha-switch>
            <label for="${configValue}">${label}</label>
        </div>
        `;
        };
        this.renderDropdown = (label, configValue, items) => {
            return (0, lit_element_1.html) `  
        <div class="form-control">
            <ha-combo-box
                label="${label}"
                .value="${this._config[configValue]}"
                .configValue="${configValue}"
                .items="${items}"
                @value-changed="${this._valueChanged}"
                @change=${this._valueChanged}
            ></ha-combo-box>
        </div>
          `;
        };
        this.renderRadio = (label, configValue, items) => {
            return (0, lit_element_1.html) `
            <div class="form-control">
                <label>${label}</label>
                ${items.map(item => {
                return (0, lit_element_1.html) `
                        <ha-radio
                            id="${configValue}_${item.value}"
                            name="${configValue}"
                            .checked="${this._config[configValue] === item.value}"
                            .configValue="${configValue}"
                            .value="${item.value}"
                            @change="${this._valueChanged}"
                        >
                        </ha-radio>
                        <label for="${configValue}_${item.value}">${item.label}</label>
                    `;
            })}
            </div>
          `;
        };
        this.renderCheckboxes = (label, configValue, items) => {
            return (0, lit_element_1.html) `
            <label>${label}</label>
            ${items.map(item => {
                return (0, lit_element_1.html) `                
                <div class="form-control">
                    <ha-checkbox
                        id="${configValue}_${item.value}"
                        name="${configValue}[]"
                        .checked="${this._config[configValue].indexOf(item.value) > -1}"
                        .configValue="${configValue}"
                        .value="${item.value}"
                        @change="${this._valueChanged}"
                    >
                    </ha-checkbox>
                    <label for="${configValue}_${item.value}">${item.label}</label>
                </div>
                `;
            })}
          `;
        };
    }
    setConfig(config) {
        this._config = config;
    }
    set hass(hass) {
        this._hass = hass;
    }
    renderForm(formRows) {
        return (0, lit_element_1.html) `
        <div class="card-config">
            ${formRows.map(row => {
            const cssClass = row.cssClass ? `form-row ${row.cssClass}` : "form-row";
            return (0, lit_element_1.html) `
                    <div class="${cssClass}">
                        <label>${row.label}</label>
                        ${row.controls.map(control => this.renderControl(control))}
                    </div>
                    `;
        })}            
        </div>
        `;
    }
    renderControl(control) {
        switch (control.type) {
            case interfaces_1.FormControlType.Dropdown:
                return this.renderDropdown(control.label, control.configValue, control.items);
            case interfaces_1.FormControlType.Radio:
                if (control.items === undefined) {
                    throw new Error("Radio control must have items defined");
                }
                return this.renderRadio(control.label, control.configValue, control.items);
            case interfaces_1.FormControlType.Checkboxes:
                if (control.items === undefined) {
                    throw new Error("Radio control must have items defined");
                }
                return this.renderCheckboxes(control.label, control.configValue, control.items);
            case interfaces_1.FormControlType.Switch:
                return this.renderSwitch(control.label, control.configValue);
            case interfaces_1.FormControlType.Textbox:
                return this.renderTextbox(control.label, control.configValue);
        }
        return (0, lit_element_1.html) ``;
    }
    _valueChanged(ev) {
        if (!this._config || !this._hass) {
            return;
        }
        const target = ev.target;
        const detail = ev.detail;
        if (target.tagName === "HA-CHECKBOX") {
            // Add or remove the value from the array
            const index = this._config[target.configValue].indexOf(target.value);
            if (target.checked && index < 0) {
                this._config[target.configValue] = [...this._config[target.configValue], target.value];
            }
            else if (!target.checked && index > -1) {
                this._config[target.configValue] = [...this._config[target.configValue].slice(0, index), ...this._config[target.configValue].slice(index + 1)];
            }
        }
        else if (target.configValue) {
            this._config = {
                ...this._config,
                [target.configValue]: target.checked !== undefined || !(detail === null || detail === void 0 ? void 0 : detail.value) ? target.value || target.checked : target.checked || detail.value,
            };
        }
        (0, custom_card_helpers_1.fireEvent)(this, "config-changed", {
            config: this._config
        });
    }
    getEntitiesByDomain(domain) {
        return Object.keys(this._hass.states)
            .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain)
            .map((item) => this.formatList(item, this._hass));
    }
    getEntitiesByDeviceClass(domain, device_class) {
        return Object.keys(this._hass.states)
            .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain && this._hass.states[eid].attributes.device_class === device_class)
            .map((item) => this.formatList(item, this._hass));
    }
    getDropdownOptionsFromEnum(enumValues) {
        const options = [];
        for (const [key, value] of Object.entries(enumValues)) {
            options.push({ value: value, label: key });
        }
        return options;
    }
    static get styles() {
        return (0, lit_element_1.css) `
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
        `;
    }
}
exports["default"] = EditorForm;


/***/ }),

/***/ 7399:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormControlType = void 0;
var FormControlType;
(function (FormControlType) {
    FormControlType["Dropdown"] = "dropdown";
    FormControlType["Checkbox"] = "checkbox";
    FormControlType["Checkboxes"] = "checkboxes";
    FormControlType["Radio"] = "radio";
    FormControlType["Switch"] = "switch";
    FormControlType["Textbox"] = "textbox";
})(FormControlType || (exports.FormControlType = FormControlType = {}));


/***/ }),

/***/ 6197:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  DEFAULT_DOMAIN_ICON: () => (/* binding */ G),
  DEFAULT_PANEL: () => (/* binding */ J),
  DEFAULT_VIEW_ENTITY_ID: () => (/* binding */ re),
  DOMAINS_HIDE_MORE_INFO: () => (/* binding */ X),
  DOMAINS_MORE_INFO_NO_HISTORY: () => (/* binding */ Y),
  DOMAINS_TOGGLE: () => (/* binding */ $),
  DOMAINS_WITH_CARD: () => (/* binding */ K),
  DOMAINS_WITH_MORE_INFO: () => (/* binding */ Q),
  NumberFormat: () => (/* binding */ t),
  STATES_OFF: () => (/* binding */ Z),
  TimeFormat: () => (/* binding */ r),
  UNIT_C: () => (/* binding */ ee),
  UNIT_F: () => (/* binding */ te),
  applyThemesOnElement: () => (/* binding */ q),
  computeCardSize: () => (/* binding */ A),
  computeDomain: () => (/* binding */ E),
  computeEntity: () => (/* binding */ j),
  computeRTL: () => (/* binding */ R),
  computeRTLDirection: () => (/* binding */ z),
  computeStateDisplay: () => (/* binding */ W),
  computeStateDomain: () => (/* binding */ L),
  createThing: () => (/* binding */ oe),
  debounce: () => (/* binding */ ue),
  domainIcon: () => (/* binding */ me),
  evaluateFilter: () => (/* binding */ se),
  fireEvent: () => (/* binding */ ne),
  fixedIcons: () => (/* binding */ ce),
  formatDate: () => (/* binding */ a),
  formatDateMonth: () => (/* binding */ f),
  formatDateMonthYear: () => (/* binding */ l),
  formatDateNumeric: () => (/* binding */ u),
  formatDateShort: () => (/* binding */ m),
  formatDateTime: () => (/* binding */ v),
  formatDateTimeNumeric: () => (/* binding */ k),
  formatDateTimeWithSeconds: () => (/* binding */ y),
  formatDateWeekday: () => (/* binding */ n),
  formatDateYear: () => (/* binding */ p),
  formatNumber: () => (/* binding */ H),
  formatTime: () => (/* binding */ D),
  formatTimeWeekday: () => (/* binding */ I),
  formatTimeWithSeconds: () => (/* binding */ F),
  forwardHaptic: () => (/* binding */ le),
  getLovelace: () => (/* binding */ ke),
  handleAction: () => (/* binding */ he),
  handleActionConfig: () => (/* binding */ pe),
  handleClick: () => (/* binding */ be),
  hasAction: () => (/* binding */ ve),
  hasConfigOrEntityChanged: () => (/* binding */ _e),
  hasDoubleClick: () => (/* binding */ ye),
  isNumericState: () => (/* binding */ P),
  navigate: () => (/* binding */ de),
  numberFormatToLocale: () => (/* binding */ U),
  relativeTime: () => (/* binding */ M),
  round: () => (/* binding */ B),
  stateIcon: () => (/* binding */ Se),
  timerTimeRemaining: () => (/* binding */ C),
  toggleEntity: () => (/* binding */ ge),
  turnOnOffEntities: () => (/* binding */ we),
  turnOnOffEntity: () => (/* binding */ fe)
});

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-utils/lib/src/diff.js
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var MS_PER_SECOND = 1e3;
var SECS_PER_MIN = 60;
var SECS_PER_HOUR = SECS_PER_MIN * 60;
var SECS_PER_DAY = SECS_PER_HOUR * 24;
var SECS_PER_WEEK = SECS_PER_DAY * 7;
function selectUnit(from, to, thresholds) {
    if (to === void 0) { to = Date.now(); }
    if (thresholds === void 0) { thresholds = {}; }
    var resolvedThresholds = __assign(__assign({}, DEFAULT_THRESHOLDS), (thresholds || {}));
    var secs = (+from - +to) / MS_PER_SECOND;
    if (Math.abs(secs) < resolvedThresholds.second) {
        return {
            value: Math.round(secs),
            unit: 'second',
        };
    }
    var mins = secs / SECS_PER_MIN;
    if (Math.abs(mins) < resolvedThresholds.minute) {
        return {
            value: Math.round(mins),
            unit: 'minute',
        };
    }
    var hours = secs / SECS_PER_HOUR;
    if (Math.abs(hours) < resolvedThresholds.hour) {
        return {
            value: Math.round(hours),
            unit: 'hour',
        };
    }
    var days = secs / SECS_PER_DAY;
    if (Math.abs(days) < resolvedThresholds.day) {
        return {
            value: Math.round(days),
            unit: 'day',
        };
    }
    var fromDate = new Date(from);
    var toDate = new Date(to);
    var years = fromDate.getFullYear() - toDate.getFullYear();
    if (Math.round(Math.abs(years)) > 0) {
        return {
            value: Math.round(years),
            unit: 'year',
        };
    }
    var months = years * 12 + fromDate.getMonth() - toDate.getMonth();
    if (Math.round(Math.abs(months)) > 0) {
        return {
            value: Math.round(months),
            unit: 'month',
        };
    }
    var weeks = secs / SECS_PER_WEEK;
    return {
        value: Math.round(weeks),
        unit: 'week',
    };
}
var DEFAULT_THRESHOLDS = {
    second: 45,
    minute: 45,
    hour: 22,
    day: 5,
};

;// CONCATENATED MODULE: ./node_modules/custom-card-helpers/dist/index.m.js
var t,r,n=function(e,t){return i(t).format(e)},i=function(e){return new Intl.DateTimeFormat(e.language,{weekday:"long",month:"long",day:"numeric"})},a=function(e,t){return o(t).format(e)},o=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric"})},u=function(e,t){return c(t).format(e)},c=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric"})},m=function(e,t){return s(t).format(e)},s=function(e){return new Intl.DateTimeFormat(e.language,{day:"numeric",month:"short"})},l=function(e,t){return d(t).format(e)},d=function(e){return new Intl.DateTimeFormat(e.language,{month:"long",year:"numeric"})},f=function(e,t){return g(t).format(e)},g=function(e){return new Intl.DateTimeFormat(e.language,{month:"long"})},p=function(e,t){return h(t).format(e)},h=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric"})};!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(t||(t={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(r||(r={}));var b=function(e){if(e.time_format===r.language||e.time_format===r.system){var t=e.time_format===r.language?e.language:void 0,n=(new Date).toLocaleString(t);return n.includes("AM")||n.includes("PM")}return e.time_format===r.am_pm},v=function(e,t){return _(t).format(e)},_=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric",hour:b(e)?"numeric":"2-digit",minute:"2-digit",hour12:b(e)})},y=function(e,t){return w(t).format(e)},w=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric",hour:b(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:b(e)})},k=function(e,t){return x(t).format(e)},x=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:b(e)})},D=function(e,t){return S(t).format(e)},S=function(e){return new Intl.DateTimeFormat(e.language,{hour:"numeric",minute:"2-digit",hour12:b(e)})},F=function(e,t){return T(t).format(e)},T=function(e){return new Intl.DateTimeFormat(e.language,{hour:b(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:b(e)})},I=function(e,t){return N(t).format(e)},N=function(e){return new Intl.DateTimeFormat(e.language,{hour:b(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:b(e)})},M=function(t,r,n,i){void 0===i&&(i=!0);var a=selectUnit(t,n);return i?function(e){return new Intl.RelativeTimeFormat(e.language,{numeric:"auto"})}(r).format(a.value,a.unit):Intl.NumberFormat(r.language,{style:"unit",unit:a.unit,unitDisplay:"long"}).format(Math.abs(a.value))};function C(e){var t,r=3600*(t=e.attributes.remaining.split(":").map(Number))[0]+60*t[1]+t[2];if("active"===e.state){var n=(new Date).getTime(),i=new Date(e.last_changed).getTime();r=Math.max(r-(n-i)/1e3,0)}return r}function O(){return(O=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}var q=function(e,t,r,n){void 0===n&&(n=!1),e._themes||(e._themes={});var i=t.default_theme;("default"===r||r&&t.themes[r])&&(i=r);var a=O({},e._themes);if("default"!==i){var o=t.themes[i];Object.keys(o).forEach(function(t){var r="--"+t;e._themes[r]="",a[r]=o[t]})}if(e.updateStyles?e.updateStyles(a):window.ShadyCSS&&window.ShadyCSS.styleSubtree(e,a),n){var u=document.querySelector("meta[name=theme-color]");if(u){u.hasAttribute("default-content")||u.setAttribute("default-content",u.getAttribute("content"));var c=a["--primary-color"]||u.getAttribute("default-content");u.setAttribute("content",c)}}},A=function(e){return"function"==typeof e.getCardSize?e.getCardSize():4};function E(e){return e.substr(0,e.indexOf("."))}function j(e){return e.substr(e.indexOf(".")+1)}function R(e){var t,r=(null==e||null==(t=e.locale)?void 0:t.language)||"en";return e.translationMetadata.translations[r]&&e.translationMetadata.translations[r].isRTL||!1}function z(e){return R(e)?"rtl":"ltr"}function L(e){return E(e.entity_id)}var P=function(e){return!!e.attributes.unit_of_measurement||!!e.attributes.state_class},U=function(e){switch(e.number_format){case t.comma_decimal:return["en-US","en"];case t.decimal_comma:return["de","es","it"];case t.space_comma:return["fr","sv","cs"];case t.system:return;default:return e.language}},B=function(e,t){return void 0===t&&(t=2),Math.round(e*Math.pow(10,t))/Math.pow(10,t)},H=function(e,r,n){var i=r?U(r):void 0;if(Number.isNaN=Number.isNaN||function e(t){return"number"==typeof t&&e(t)},(null==r?void 0:r.number_format)!==t.none&&!Number.isNaN(Number(e))&&Intl)try{return new Intl.NumberFormat(i,V(e,n)).format(Number(e))}catch(t){return console.error(t),new Intl.NumberFormat(void 0,V(e,n)).format(Number(e))}return"string"==typeof e?e:B(e,null==n?void 0:n.maximumFractionDigits).toString()+("currency"===(null==n?void 0:n.style)?" "+n.currency:"")},V=function(e,t){var r=O({maximumFractionDigits:2},t);if("string"!=typeof e)return r;if(!t||!t.minimumFractionDigits&&!t.maximumFractionDigits){var n=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=n,r.maximumFractionDigits=n}return r},W=function(e,t,r,n){var i=void 0!==n?n:t.state;if("unknown"===i||"unavailable"===i)return e("state.default."+i);if(P(t)){if("monetary"===t.attributes.device_class)try{return H(i,r,{style:"currency",currency:t.attributes.unit_of_measurement})}catch(e){}return H(i,r)+(t.attributes.unit_of_measurement?" "+t.attributes.unit_of_measurement:"")}var o=L(t);if("input_datetime"===o){var u;if(void 0===n)return t.attributes.has_date&&t.attributes.has_time?(u=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day,t.attributes.hour,t.attributes.minute),v(u,r)):t.attributes.has_date?(u=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day),a(u,r)):t.attributes.has_time?((u=new Date).setHours(t.attributes.hour,t.attributes.minute),D(u,r)):t.state;try{var c=n.split(" ");if(2===c.length)return v(new Date(c.join("T")),r);if(1===c.length){if(n.includes("-"))return a(new Date(n+"T00:00"),r);if(n.includes(":")){var m=new Date;return D(new Date(m.toISOString().split("T")[0]+"T"+n),r)}}return n}catch(e){return n}}return"humidifier"===o&&"on"===i&&t.attributes.humidity?t.attributes.humidity+" %":"counter"===o||"number"===o||"input_number"===o?H(i,r):t.attributes.device_class&&e("component."+o+".state."+t.attributes.device_class+"."+i)||e("component."+o+".state._."+i)||i},G="mdi:bookmark",J="lovelace",K=["climate","cover","configurator","input_select","input_number","input_text","lock","media_player","scene","script","timer","vacuum","water_heater","weblink"],Q=["alarm_control_panel","automation","camera","climate","configurator","cover","fan","group","history_graph","input_datetime","light","lock","media_player","script","sun","updater","vacuum","water_heater","weather"],X=["input_number","input_select","input_text","scene","weblink"],Y=["camera","configurator","history_graph","scene"],Z=["closed","locked","off"],$=new Set(["fan","input_boolean","light","switch","group","automation"]),ee="°C",te="°F",re="group.default_view",ne=function(e,t,r,n){n=n||{},r=null==r?{}:r;var i=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return i.detail=r,e.dispatchEvent(i),i},ie=new Set(["call-service","divider","section","weblink","cast","select"]),ae={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},oe=function(e,t){void 0===t&&(t=!1);var r=function(e,t){return n("hui-error-card",{type:"error",error:e,config:t})},n=function(e,t){var n=window.document.createElement(e);try{if(!n.setConfig)return;n.setConfig(t)}catch(n){return console.error(e,n),r(n.message,t)}return n};if(!e||"object"!=typeof e||!t&&!e.type)return r("No type defined",e);var i=e.type;if(i&&i.startsWith("custom:"))i=i.substr("custom:".length);else if(t)if(ie.has(i))i="hui-"+i+"-row";else{if(!e.entity)return r("Invalid config given.",e);var a=e.entity.split(".",1)[0];i="hui-"+(ae[a]||"text")+"-entity-row"}else i="hui-"+i+"-card";if(customElements.get(i))return n(i,e);var o=r("Custom element doesn't exist: "+e.type+".",e);o.style.display="None";var u=setTimeout(function(){o.style.display=""},2e3);return customElements.whenDefined(e.type).then(function(){clearTimeout(u),ne(o,"ll-rebuild",{},o)}),o},ue=function(e,t,r){var n;return void 0===r&&(r=!1),function(){var i=[].slice.call(arguments),a=this,o=function(){n=null,r||e.apply(a,i)},u=r&&!n;clearTimeout(n),n=setTimeout(o,t),u&&e.apply(a,i)}},ce={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function me(e,t){if(e in ce)return ce[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return t&&"off"===t?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===t?"mdi:window-closed":"mdi:window-open";case"lock":return t&&"unlocked"===t?"mdi:lock-open":"mdi:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"mdi:cast-connected":"mdi:cast";case"zwave":switch(t){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+e+" ("+t+")"),"mdi:bookmark"}}var se=function(e,t){var r=t.value||t,n=t.attribute?e.attributes[t.attribute]:e.state;switch(t.operator||"=="){case"==":return n===r;case"<=":return n<=r;case"<":return n<r;case">=":return n>=r;case">":return n>r;case"!=":return n!==r;case"regex":return n.match(r);default:return!1}},le=function(e){ne(window,"haptic",e)},de=function(e,t,r){void 0===r&&(r=!1),r?history.replaceState(null,"",t):history.pushState(null,"",t),ne(window,"location-changed",{replace:r})},fe=function(e,t,r){void 0===r&&(r=!0);var n,i=E(t),a="group"===i?"homeassistant":i;switch(i){case"lock":n=r?"unlock":"lock";break;case"cover":n=r?"open_cover":"close_cover";break;default:n=r?"turn_on":"turn_off"}return e.callService(a,n,{entity_id:t})},ge=function(e,t){var r=Z.includes(e.states[t].state);return fe(e,t,r)},pe=function(e,t,r,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some(function(e){return e.user===t.user.id})||(le("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(r.entity||r.camera_image)&&ne(e,"hass-more-info",{entityId:r.entity?r.entity:r.camera_image});break;case"navigate":n.navigation_path&&de(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":r.entity&&(ge(t,r.entity),le("success"));break;case"call-service":if(!n.service)return void le("failure");var i=n.service.split(".",2);t.callService(i[0],i[1],n.service_data,n.target),le("success");break;case"fire-dom-event":ne(e,"ll-custom",n)}},he=function(e,t,r,n){var i;"double_tap"===n&&r.double_tap_action?i=r.double_tap_action:"hold"===n&&r.hold_action?i=r.hold_action:"tap"===n&&r.tap_action&&(i=r.tap_action),pe(e,t,r,i)},be=function(e,t,r,n,i){var a;if(i&&r.double_tap_action?a=r.double_tap_action:n&&r.hold_action?a=r.hold_action:!n&&r.tap_action&&(a=r.tap_action),a||(a={action:"more-info"}),!a.confirmation||a.confirmation.exemptions&&a.confirmation.exemptions.some(function(e){return e.user===t.user.id})||confirm(a.confirmation.text||"Are you sure you want to "+a.action+"?"))switch(a.action){case"more-info":(a.entity||r.entity||r.camera_image)&&(ne(e,"hass-more-info",{entityId:a.entity?a.entity:r.entity?r.entity:r.camera_image}),a.haptic&&le(a.haptic));break;case"navigate":a.navigation_path&&(de(0,a.navigation_path),a.haptic&&le(a.haptic));break;case"url":a.url_path&&window.open(a.url_path),a.haptic&&le(a.haptic);break;case"toggle":r.entity&&(ge(t,r.entity),a.haptic&&le(a.haptic));break;case"call-service":if(!a.service)return;var o=a.service.split(".",2),u=o[0],c=o[1],m=O({},a.service_data);"entity"===m.entity_id&&(m.entity_id=r.entity),t.callService(u,c,m,a.target),a.haptic&&le(a.haptic);break;case"fire-dom-event":ne(e,"ll-custom",a),a.haptic&&le(a.haptic)}};function ve(e){return void 0!==e&&"none"!==e.action}function _e(e,t,r){if(t.has("config")||r)return!0;if(e.config.entity){var n=t.get("hass");return!n||n.states[e.config.entity]!==e.hass.states[e.config.entity]}return!1}function ye(e){return void 0!==e&&"none"!==e.action}var we=function(e,t,r){void 0===r&&(r=!0);var n={};t.forEach(function(t){if(Z.includes(e.states[t].state)===r){var i=E(t),a=["cover","lock"].includes(i)?i:"homeassistant";a in n||(n[a]=[]),n[a].push(t)}}),Object.keys(n).forEach(function(t){var i;switch(t){case"lock":i=r?"unlock":"lock";break;case"cover":i=r?"open_cover":"close_cover";break;default:i=r?"turn_on":"turn_off"}e.callService(t,i,{entity_id:n[t]})})},ke=function(){var e=document.querySelector("home-assistant");if(e=(e=(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root")){var t=e.lovelace;return t.current_view=e.___curView,t}return null},xe={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},De={binary_sensor:function(e,t){var r="off"===e;switch(null==t?void 0:t.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"cold":return r?"mdi:thermometer":"mdi:snowflake";case"connectivity":return r?"mdi:server-network-off":"mdi:server-network";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:check-circle":"mdi:smoke";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:walk":"mdi:run";case"occupancy":return r?"mdi:home-outline":"mdi:home";case"opening":return r?"mdi:square":"mdi:square-outline";case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(e){var t="closed"!==e.state;switch(e.attributes.device_class){case"garage":return t?"mdi:garage-open":"mdi:garage";case"door":return t?"mdi:door-open":"mdi:door-closed";case"shutter":return t?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return t?"mdi:blinds-open":"mdi:blinds";case"window":return t?"mdi:window-open":"mdi:window-closed";default:return me("cover",e.state)}},sensor:function(e){var t=e.attributes.device_class;if(t&&t in xe)return xe[t];if("battery"===t){var r=Number(e.state);if(isNaN(r))return"mdi:battery-unknown";var n=10*Math.round(r/10);return n>=100?"mdi:battery":n<=0?"mdi:battery-alert":"hass:battery-"+n}var i=e.attributes.unit_of_measurement;return"°C"===i||"°F"===i?"mdi:thermometer":me("sensor")},input_datetime:function(e){return e.attributes.has_date?e.attributes.has_time?me("input_datetime"):"mdi:calendar":"mdi:clock"}},Se=function(e){if(!e)return"mdi:bookmark";if(e.attributes.icon)return e.attributes.icon;var t=E(e.entity_id);return t in De?De[t](e):me(t,e.state)};
//# sourceMappingURL=index.m.js.map


/***/ }),

/***/ 239:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientBase = void 0;
class ClientBase {
    GetData(endpoint, cacheResult, hoursBeforeInvalid) {
        return __awaiter(this, void 0, void 0, function* () {
            const localStorageData = localStorage.getItem(endpoint);
            if (localStorageData && cacheResult) {
                const item = JSON.parse(localStorageData);
                const checkDate = new Date();
                checkDate.setHours(checkDate.getHours() - hoursBeforeInvalid);
                if (new Date(item.created) > checkDate) {
                    return JSON.parse(item.data);
                }
            }
            const response = yield fetch(`${this.baseUrl}/${endpoint}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            if (!response || !response.ok) {
                return Promise.reject(response);
            }
            const data = yield response.json();
            const item = {
                data: JSON.stringify(data),
                created: new Date()
            };
            if (cacheResult) {
                localStorage.setItem(endpoint, JSON.stringify(item));
            }
            return data;
        });
    }
}
exports.ClientBase = ClientBase;


/***/ }),

/***/ 171:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(8593);
const client_base_1 = __webpack_require__(239);
class ErgastClient extends client_base_1.ClientBase {
    constructor() {
        super(...arguments);
        this.baseUrl = 'https://ergast.com/api/f1';
    }
    GetSchedule(season) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.GetData(`${season}.json`, true, 72);
            return data.MRData.RaceTable.Races;
        });
    }
    GetLastResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshCacheHours = (0, utils_1.getRefreshTime)('current/last/results.json');
            const data = yield this.GetData('current/last/results.json', true, refreshCacheHours);
            return data.MRData.RaceTable.Races[0];
        });
    }
    GetDriverStandings() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshCacheHours = (0, utils_1.getRefreshTime)('current/driverStandings.json');
            const data = yield this.GetData('current/driverStandings.json', true, refreshCacheHours);
            return data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        });
    }
    GetConstructorStandings() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshCacheHours = (0, utils_1.getRefreshTime)('current/constructorStandings.json');
            const data = yield this.GetData('current/constructorStandings.json', true, refreshCacheHours);
            return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        });
    }
    GetSprintResults(season, round) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.GetData(`${season}/${round}/sprint.json`, false, 0);
            return data.MRData.RaceTable;
        });
    }
    GetQualifyingResults(season, round) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.GetData(`${season}/${round}/qualifying.json`, false, 0);
            return data.MRData.RaceTable;
        });
    }
    GetResults(season, round) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.GetData(`${season}/${round}/results.json`, false, 0);
            return data.MRData.RaceTable;
        });
    }
    GetSeasons() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.GetData('seasons.json?limit=200', true, 72);
            return data.MRData.SeasonTable.Seasons;
        });
    }
    GetSeasonRaces(season) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.GetData(`${season}.json`, true, 72);
            return data.MRData.RaceTable.Races;
        });
    }
    GetLastYearsResults(circuitName) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastYear = new Date().getFullYear() - 1;
            const data = yield this.GetData(`${lastYear}.json`, true, 72);
            const raceRound = data.MRData.RaceTable.Races.findIndex((race) => {
                return race.Circuit.circuitName === circuitName;
            }) + 1;
            const results = yield this.GetData(`${lastYear}/${raceRound}/results.json`, false, 0);
            return results.MRData.RaceTable.Races[0];
        });
    }
}
exports["default"] = ErgastClient;


/***/ }),

/***/ 4099:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ImageClient {
    GetImage(url) {
        const localStorageData = localStorage.getItem(url);
        if (localStorageData) {
            const item = JSON.parse(localStorageData);
            const checkDate = new Date();
            checkDate.setHours(checkDate.getHours() - (24 * 7 * 4));
            if (new Date(item.created) > checkDate) {
                return item.data;
            }
        }
        fetch(url)
            .then(response => response.blob())
            .then(imageBlob => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = function () {
                const base64data = reader.result;
                const item = {
                    data: base64data,
                    created: new Date()
                };
                localStorage.setItem(url, JSON.stringify(item));
                return item.data;
            };
        });
        return url;
    }
}
exports["default"] = ImageClient;


/***/ }),

/***/ 2930:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_base_1 = __webpack_require__(239);
class RestCountryClient extends client_base_1.ClientBase {
    constructor() {
        super(...arguments);
        this.baseUrl = 'https://restcountries.com/v2';
    }
    GetAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.GetData('all', true, 730);
        });
    }
    GetCountriesFromLocalStorage() {
        const localStorageData = localStorage.getItem('all');
        if (localStorageData) {
            const item = JSON.parse(localStorageData);
            return JSON.parse(item.data);
        }
        return [];
    }
}
exports["default"] = RestCountryClient;


/***/ }),

/***/ 4820:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_base_1 = __webpack_require__(239);
class WeatherClient extends client_base_1.ClientBase {
    constructor(apiKey, unitGroup) {
        super();
        this.unitGroup = 'metric';
        this.baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
        this.apiKey = apiKey;
        this.unitGroup = unitGroup !== null && unitGroup !== void 0 ? unitGroup : this.unitGroup;
    }
    getWeatherData(latitude, longitude, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `${latitude},${longitude}/${date}`;
            const contentType = 'json';
            const url = `${endpoint}?unitGroup=${this.unitGroup}&key=${this.apiKey}&contentType=${contentType}`;
            const data = yield this.GetData(url, true, 1);
            return data;
        });
    }
}
exports["default"] = WeatherClient;


/***/ }),

/***/ 5243:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseCard = void 0;
const ergast_client_1 = __webpack_require__(171);
const image_client_1 = __webpack_require__(4099);
const weather_client_1 = __webpack_require__(4820);
class BaseCard {
    constructor(parent) {
        var _a, _b;
        this.config = parent.config;
        this.client = new ergast_client_1.default();
        this.hass = parent._hass;
        this.parent = parent;
        this.weatherClient = new weather_client_1.default((_b = (_a = this.config.weather_options) === null || _a === void 0 ? void 0 : _a.api_key) !== null && _b !== void 0 ? _b : '');
        this.imageClient = new image_client_1.default();
    }
    translation(key) {
        if (!this.config.translations || Object.keys(this.config.translations).indexOf(key) < 0) {
            return this.defaultTranslations[key];
        }
        return this.config.translations[key];
    }
    getProperties() {
        var _a, _b;
        const cardProperties = (_a = this.parent.properties) === null || _a === void 0 ? void 0 : _a.get('cardValues');
        const races = cardProperties === null || cardProperties === void 0 ? void 0 : cardProperties.races;
        const selectedRace = cardProperties === null || cardProperties === void 0 ? void 0 : cardProperties.selectedRace;
        const selectedSeason = cardProperties === null || cardProperties === void 0 ? void 0 : cardProperties.selectedSeason;
        const selectedTabIndex = (_b = cardProperties === null || cardProperties === void 0 ? void 0 : cardProperties.selectedTabIndex) !== null && _b !== void 0 ? _b : 0;
        return { races, selectedRace, selectedSeason, selectedTabIndex };
    }
    getParentCardValues() {
        var _a, _b;
        const cardValues = (_a = this.parent.properties) !== null && _a !== void 0 ? _a : new Map();
        const properties = (_b = cardValues.get('cardValues')) !== null && _b !== void 0 ? _b : {};
        return { properties, cardValues };
    }
}
exports.BaseCard = BaseCard;


/***/ }),

/***/ 6521:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
class ConstructorStandings extends base_card_1.BaseCard {
    constructor(parent) {
        super(parent);
        this.defaultTranslations = {
            'constructor': 'Constructor',
            'points': 'Pts',
            'wins': 'Wins'
        };
    }
    cardSize() {
        return 11;
    }
    renderStandingRow(standing) {
        var _a;
        return (0, lit_html_1.html) `
            <tr>
                <td class="width-50 text-center">${standing.position}</td>
                <td>${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_teamlogo) ? (0, lit_html_1.html) `<img class="constructor-logo" height="20" width="20" src="${(0, utils_1.getTeamImage)(this, standing.Constructor.constructorId)}">&nbsp;` : '')}${standing.Constructor.name}</td>
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }
    render() {
        return (0, lit_html_1.html) `${(0, until_js_1.until)(this.client.GetConstructorStandings().then(response => (0, lit_html_1.html) `
                    <table>
                        <thead>
                        <tr>
                            <th class="width-50">&nbsp;</th>
                            <th>${this.translation('constructor')}</th>
                            <th class="width-60 text-center">${this.translation('points')}</th>
                            <th class="text-center">${this.translation('wins')}</th>
                        </tr>
                        </thead>
                        <tbody>
                            ${(0, utils_1.reduceArray)(response, this.config.row_limit).map(standing => this.renderStandingRow(standing))}
                        </tbody>
                    </table>
                    `)
            .catch(() => (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('standings')}`), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}`;
    }
}
exports["default"] = ConstructorStandings;


/***/ }),

/***/ 2765:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
const async_replace_js_1 = __webpack_require__(530);
const custom_card_helpers_1 = __webpack_require__(6197);
const action_handler_directive_1 = __webpack_require__(8342);
const formulaone_card_types_1 = __webpack_require__(9098);
class Countdown extends base_card_1.BaseCard {
    constructor(parent) {
        var _a;
        super(parent);
        this.defaultTranslations = {
            'days': 'd',
            'hours': 'h',
            'minutes': 'm',
            'seconds': 's',
            'endofseason': 'Season is over. See you next year!',
            'racenow': 'We are racing!',
            'date': 'Date',
            'practice1': 'Practice 1',
            'practice2': 'Practice 2',
            'practice3': 'Practice 3',
            'race': 'Race',
            'racename': 'Race name',
            'circuitname': 'Circuit name',
            'location': 'Location',
            'city': 'City',
            'racetime': 'Race',
            'sprint': 'Sprint',
            'qualifying': 'Qualifying',
            'until': 'Until'
        };
        this.config.countdown_type = (_a = this.config.countdown_type) !== null && _a !== void 0 ? _a : formulaone_card_types_1.CountdownType.Race;
    }
    cardSize() {
        return this.config.show_raceinfo ? 12 : 6;
    }
    renderHeader(race, raceDateTime) {
        return this.config.show_raceinfo ?
            (0, lit_html_1.html) `<table><tr><td colspan="5">${(0, utils_1.renderHeader)(this, race, true)}</td></tr>
            ${(0, utils_1.renderRaceInfo)(this, race, raceDateTime)}</table>`
            : null;
    }
    countDownTillDate(raceDateTime) {
        return __asyncGenerator(this, arguments, function* countDownTillDate_1() {
            while (raceDateTime > new Date()) {
                const now = new Date().getTime();
                const distance = raceDateTime.getTime() - now;
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                yield yield __await(`${days}${this.translation('days')} ${hours}${this.translation('hours')} ${minutes}${this.translation('minutes')} ${seconds}${this.translation('seconds')} `);
                yield __await(new Promise((r) => setTimeout(r, 1000)));
            }
            yield yield __await(this.translation('racenow'));
        });
    }
    render() {
        const _handleAction = (ev) => {
            if (this.hass && this.config.actions && ev.detail.action) {
                (0, utils_1.clickHandler)(this.parent, this.config, this.hass, ev);
            }
        };
        return (0, lit_html_1.html) `${(0, until_js_1.until)(this.client.GetSchedule(new Date().getFullYear()).then(response => {
            var _a, _b;
            const { nextRace, raceDateTime, countdownType } = this.getNextEvent(response);
            if (!nextRace) {
                return (0, utils_1.getEndOfSeasonMessage)(this.translation('endofseason'));
            }
            const timer = this.countDownTillDate(raceDateTime);
            const hasConfigAction = this.config.actions !== undefined;
            return (0, lit_html_1.html) `<table @action=${_handleAction}
                                .actionHandler=${(0, action_handler_directive_1.actionHandler)({
                hasHold: (0, custom_card_helpers_1.hasAction)((_a = this.config.actions) === null || _a === void 0 ? void 0 : _a.hold_action),
                hasDoubleClick: (0, custom_card_helpers_1.hasAction)((_b = this.config.actions) === null || _b === void 0 ? void 0 : _b.double_tap_action),
            })} class="${(hasConfigAction ? 'clickable' : null)}">
                                <tr>
                                    <td>
                                        <h2 class="${(this.config.f1_font ? 'formulaone-font' : '')}"><img height="25" src="${(0, utils_1.getCountryFlagByName)(this, nextRace.Circuit.Location.country)}">&nbsp;&nbsp;  ${nextRace.round} :  ${nextRace.raceName}</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center">
                                        <h1 class="${(this.config.f1_font ? 'formulaone-font' : '')}">${(0, async_replace_js_1.asyncReplace)(timer)}</h1>
                                    </td>
                                </tr>
                                ${(Array.isArray(this.config.countdown_type) && this.config.countdown_type.length > 1 ?
                (0, lit_html_1.html) `<tr>
                                                <td class="text-center">
                                                    <h1 class="${(this.config.f1_font ? 'formulaone-font' : '')}">${this.translation('until')} ${this.translation(countdownType.toLowerCase())}</h1>
                                                </td>
                                            </tr>`
                : null)}
                            </table>
                            ${this.renderHeader(nextRace, raceDateTime)}`;
        }).catch(() => {
            return (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('next race')}`;
        }), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}`;
    }
    getNextEvent(response) {
        var _a;
        const nextRace = response.filter(race => {
            const raceDateTime = new Date(race.date + 'T' + race.time);
            raceDateTime.setHours(raceDateTime.getHours() + 3);
            return raceDateTime >= new Date();
        })[0];
        let raceDateTime = null;
        let countdownType = this.config.countdown_type;
        if (nextRace) {
            const countdownTypes = this.config.countdown_type;
            const raceEvents = [
                { Date: new Date(nextRace.FirstPractice.date + 'T' + nextRace.FirstPractice.time), Type: formulaone_card_types_1.CountdownType.Practice1 },
                { Date: new Date(nextRace.SecondPractice.date + 'T' + nextRace.SecondPractice.time), Type: formulaone_card_types_1.CountdownType.Practice2 },
                { Date: nextRace.ThirdPractice ? new Date(nextRace.ThirdPractice.date + 'T' + nextRace.ThirdPractice.time) : null, Type: formulaone_card_types_1.CountdownType.Practice3 },
                { Date: nextRace.Sprint ? new Date(nextRace.Sprint.date + 'T' + nextRace.Sprint.time) : null, Type: formulaone_card_types_1.CountdownType.Sprint },
                { Date: new Date(nextRace.Qualifying.date + 'T' + nextRace.Qualifying.time), Type: formulaone_card_types_1.CountdownType.Qualifying },
                { Date: new Date(nextRace.date + 'T' + nextRace.time), Type: formulaone_card_types_1.CountdownType.Race }
            ].filter(x => x.Date).filter(x => x.Date > new Date()).sort((a, b) => a.Date.getTime() - b.Date.getTime());
            const nextEvent = raceEvents.filter(x => countdownTypes === null || countdownTypes === void 0 ? void 0 : countdownTypes.includes(x.Type))[0];
            raceDateTime = nextEvent === null || nextEvent === void 0 ? void 0 : nextEvent.Date;
            countdownType = (_a = nextEvent === null || nextEvent === void 0 ? void 0 : nextEvent.Type) !== null && _a !== void 0 ? _a : countdownType;
        }
        return { nextRace, raceDateTime, countdownType };
    }
}
exports["default"] = Countdown;


/***/ }),

/***/ 9412:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
class DriverStandings extends base_card_1.BaseCard {
    constructor(parent) {
        super(parent);
        this.defaultTranslations = {
            'driver': 'Driver',
            'team': 'Team',
            'points': 'Pts',
            'wins': 'Wins'
        };
    }
    cardSize() {
        return 12;
    }
    renderStandingRow(standing) {
        var _a, _b;
        return (0, lit_html_1.html) `
            <tr>
                <td class="width-40 text-center">${standing.position}</td>
                <td>${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_flag) ? (0, lit_html_1.html) `<img height="10" width="20" src="${(0, utils_1.getCountryFlagByNationality)(this, standing.Driver.nationality)}">&nbsp;` : '')}${standing.Driver.code}</td>
                <td>${(0, utils_1.getDriverName)(standing.Driver, this.config)}</td>
                ${(((_b = this.config.standings) === null || _b === void 0 ? void 0 : _b.show_team) ? (0, lit_html_1.html) `${(0, utils_1.renderConstructorColumn)(this, standing.Constructors[0])}` : '')}
                <td class="width-60 text-center">${standing.points}</td>
                <td class="text-center">${standing.wins}</td>
            </tr>`;
    }
    render() {
        return (0, lit_html_1.html) `${(0, until_js_1.until)(this.client.GetDriverStandings().then(response => {
            var _a;
            return (0, lit_html_1.html) `
                    <table>
                        <thead>
                        <tr>
                            <th class="width-50" colspan="2">&nbsp;</th>
                            <th>${this.translation('driver')}</th>                
                            ${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_team) ? (0, lit_html_1.html) `<th>${this.translation('team')}</th>` : '')}
                            <th class="width-60 text-center">${this.translation('points')}</th>
                            <th class="text-center">${this.translation('wins')}</th>
                        </tr>
                        </thead>
                        <tbody>
                            ${(0, utils_1.reduceArray)(response, this.config.row_limit).map(standing => this.renderStandingRow(standing))}
                        </tbody>
                    </table>
                    `;
        })
            .catch(() => (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('standings')}`), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}`;
    }
}
exports["default"] = DriverStandings;


/***/ }),

/***/ 1958:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
class LastResult extends base_card_1.BaseCard {
    constructor(parent) {
        super(parent);
        this.defaultTranslations = {
            'driver': 'Driver',
            'grid': 'Grid',
            'points': 'Points',
            'status': 'Status'
        };
    }
    cardSize() {
        return 11;
    }
    renderResultRow(result) {
        return (0, lit_html_1.html) `
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(0, utils_1.getDriverName)(result.Driver, this.config)}</td>
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="width-50 text-center">${result.status}</td>
            </tr>`;
    }
    render() {
        return (0, lit_html_1.html) `${(0, until_js_1.until)(this.client.GetLastResult().then(response => (0, lit_html_1.html) ` 
                    <table>
                        <tr>
                            <td>${(0, utils_1.renderHeader)(this, response)}</td>
                        </tr>
                    </table>
                    <table>
                        <thead>                    
                            <tr>
                                <th>&nbsp;</th>
                                <th>${this.translation('driver')}</th>
                                <th class="text-center">${this.translation('grid')}</th>
                                <th class="text-center">${this.translation('points')}</th>
                                <th>${this.translation('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(0, utils_1.reduceArray)(response.Results, this.config.row_limit).map(result => this.renderResultRow(result))}
                        </tbody>
                    </table>`)
            .catch(() => (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('last result')}`), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}`;
    }
}
exports["default"] = LastResult;


/***/ }),

/***/ 1249:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
const format_date_1 = __webpack_require__(3247);
class NextRace extends base_card_1.BaseCard {
    constructor() {
        super(...arguments);
        this.defaultTranslations = {
            'date': 'Date',
            'practice1': 'Practice 1',
            'practice2': 'Practice 2',
            'practice3': 'Practice 3',
            'race': 'Race',
            'racename': 'Race name',
            'circuitname': 'Circuit name',
            'location': 'Location',
            'city': 'City',
            'racetime': 'Race',
            'sprint': 'Sprint',
            'qualifying': 'Qualifying',
            'endofseason': 'Season is over. See you next year!',
        };
    }
    cardSize() {
        return 8;
    }
    render() {
        return (0, lit_html_1.html) `${(0, until_js_1.until)(this.client.GetSchedule(new Date().getFullYear()).then(response => {
            const delay = this.config.next_race_delay || 0;
            const nextRace = response.filter(race => {
                const nextRaceDate = new Date(race.date + 'T' + race.time);
                nextRaceDate.setHours(nextRaceDate.getHours() + delay);
                return nextRaceDate >= new Date();
            })[0];
            if (!nextRace) {
                return (0, utils_1.getEndOfSeasonMessage)(this.translation('endofseason'));
            }
            return (0, lit_html_1.html) `<table>
                        <tbody>
                            <tr>
                                <td colspan="5">${(0, utils_1.renderHeader)(this, nextRace)}</td>
                            </tr>
                            ${this.config.show_raceinfo ?
                (0, utils_1.renderRaceInfo)(this, nextRace) :
                this.config.only_show_date ?
                    (0, lit_html_1.html) `<tr>
                                        <td class="text-center">
                                            <h1 class="${(this.config.f1_font ? 'formulaone-font' : '')}">${(0, format_date_1.formatDateNumeric)(new Date(nextRace.date + 'T' + nextRace.time), this.hass.locale, this.config.date_locale)}</h1>
                                        </td>
                                    </tr>` : null}  
                        </tbody>
                    </table>`;
        }).catch(() => {
            return (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('next race')}`;
        }), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}`;
    }
}
exports["default"] = NextRace;


/***/ }),

/***/ 5903:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
class Results extends base_card_1.BaseCard {
    constructor(parent) {
        super(parent);
        this.defaultTranslations = {
            'driver': 'Driver',
            'grid': 'Grid',
            'team': 'Team',
            'points': 'Points',
            'status': 'Status',
            'raceheader': 'Race',
            'seasonheader': 'Season',
            'selectseason': 'Select season',
            'selectrace': 'Select race',
            'noresults': 'Please select a race thats already been run.',
            'q1': 'Q1',
            'q2': 'Q2',
            'q3': 'Q3',
        };
        this.icons = {
            'sprint': 'mdi:flag-checkered',
            'qualifying': 'mdi:timer-outline',
            'results': 'mdi:trophy',
        };
        this.renderTabsHtml = (tabs, selectedTabIndex, selectedRace) => {
            return selectedRace
                ? (0, lit_html_1.html) `<table>
                        <tr><td colspan="2">${this.renderHeader(selectedRace)}</td></tr>
                        ${tabs.filter(tab => tab.content).length > 0 ?
                    (0, lit_html_1.html) `<tr class="transparent">
                                <td colspan="2">
                                    <mwc-tab-bar
                                    @MDCTabBar:activated=${(ev) => (this.setSelectedTabIndex(ev.detail.index))}
                                >
                                ${tabs.filter(tab => !tab.hide).map((tab) => (0, lit_html_1.html) `
                                            <mwc-tab
                                            ?hasImageIcon=${tab.icon}
                                            ><ha-icon
                                                    slot="icon"
                                                    icon="${tab.icon}"
                                                ></ha-icon>
                                            </mwc-tab>
                                        `)}                    
                                </mwc-tab-bar>
                                <section>
                                    <article>
                                    ${tabs.filter(tab => !tab.hide).find((_, index) => index == selectedTabIndex).content}
                                    </article>
                                </section>
                                </td>
                            </tr>` : (0, lit_html_1.html) `<tr><td colspan="2">${this.translation('noresults')}</td></tr>`}                    
                    </table>`
                : (0, lit_html_1.html) ``;
        };
    }
    cardSize() {
        return 12;
    }
    renderTabs(selectedRace) {
        const tabs = [{
                title: 'Results',
                icon: this.icon('results'),
                content: this.renderResults(selectedRace),
                order: this.tabOrder('results')
            }, {
                title: 'Qualifying',
                icon: this.icon('qualifying'),
                content: this.renderQualifying(selectedRace),
                order: this.tabOrder('qualifying')
            }, {
                title: 'Sprint',
                icon: this.icon('sprint'),
                content: this.renderSprint(selectedRace),
                hide: !(selectedRace === null || selectedRace === void 0 ? void 0 : selectedRace.SprintResults),
                order: this.tabOrder('sprint')
            }];
        return tabs.sort((a, b) => a.order - b.order);
    }
    renderSprint(selectedRace) {
        var _a;
        return (selectedRace === null || selectedRace === void 0 ? void 0 : selectedRace.SprintResults) ?
            (0, lit_html_1.html) `<table class="nopadding">
                    <thead>                    
                        <tr>
                            <th>&nbsp;</th>
                            <th>${this.translation('driver')}</th>
                            ${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_team) ? (0, lit_html_1.html) `<th>${this.translation('team')}</th>` : '')}
                            <th class="text-center">${this.translation('grid')}</th>
                            <th class="text-center">${this.translation('points')}</th>
                            <th class="text-center">${this.translation('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(0, utils_1.reduceArray)(selectedRace.SprintResults, this.config.row_limit).map(result => this.renderResultRow(result, false))}
                    </tbody>
                </table>`
            : null;
    }
    renderQualifying(selectedRace) {
        var _a;
        return (selectedRace === null || selectedRace === void 0 ? void 0 : selectedRace.QualifyingResults) ?
            (0, lit_html_1.html) `<table class="nopadding">
                    <thead>                   
                        <tr>
                            <th>&nbsp;</th>
                            <th>${this.translation('driver')}</th>
                            ${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_team) ? (0, lit_html_1.html) `<th>${this.translation('team')}</th>` : '')}
                            <th class="text-center">${this.translation('q1')}</th>
                            <th class="text-center">${this.translation('q2')}</th>
                            <th class="text-center">${this.translation('q3')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(0, utils_1.reduceArray)(selectedRace.QualifyingResults, this.config.row_limit).map(result => this.renderQualifyingResultRow(result))}
                    </tbody>
                </table>`
            : null;
    }
    renderResults(selectedRace) {
        var _a, _b;
        const fastest = (_a = selectedRace === null || selectedRace === void 0 ? void 0 : selectedRace.Results) === null || _a === void 0 ? void 0 : _a.filter((result) => { var _a; return ((_a = result.FastestLap) === null || _a === void 0 ? void 0 : _a.rank) === '1'; })[0];
        return (selectedRace === null || selectedRace === void 0 ? void 0 : selectedRace.Results) ?
            (0, lit_html_1.html) `<table class="nopadding">
                    <thead>                    
                        <tr>
                            <th>&nbsp;</th>
                            <th>${this.translation('driver')}</th>
                            ${(((_b = this.config.standings) === null || _b === void 0 ? void 0 : _b.show_team) ? (0, lit_html_1.html) `<th>${this.translation('team')}</th>` : '')}
                            <th class="text-center">${this.translation('grid')}</th>
                            <th class="text-center">${this.translation('points')}</th>
                            <th>${this.translation('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(0, utils_1.reduceArray)(selectedRace.Results, this.config.row_limit).map(result => this.renderResultRow(result, result.position === (fastest === null || fastest === void 0 ? void 0 : fastest.position)))}
                    </tbody>
                    ${fastest ? (0, lit_html_1.html) `<tfoot>
                    <tfoot>
                        <tr>
                            <td colspan="6" class="text-right"><small>* Fastest lap: ${fastest.FastestLap.Time.time}</small></td>
                    </tfoot>` : ''}
                </table>`
            : null;
    }
    renderResultRow(result, fastest) {
        var _a, _b;
        return (0, lit_html_1.html) `
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_flag) ? (0, lit_html_1.html) `<img height="10" width="20" src="${(0, utils_1.getCountryFlagByNationality)(this, result.Driver.nationality)}">&nbsp;` : '')}${(0, utils_1.getDriverName)(result.Driver, this.config)}${fastest ? ' *' : ''}</td>
                ${(((_b = this.config.standings) === null || _b === void 0 ? void 0 : _b.show_team) ? (0, lit_html_1.html) `${(0, utils_1.renderConstructorColumn)(this, result.Constructor)}` : '')}
                <td>${result.grid}</td>
                <td class="width-60 text-center">${result.points}</td>
                <td class="width-50 text-center">${result.status}</td>
            </tr>`;
    }
    renderQualifyingResultRow(result) {
        var _a, _b;
        return (0, lit_html_1.html) `
            <tr>
                <td class="width-50 text-center">${result.position}</td>
                <td>${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_flag) ? (0, lit_html_1.html) `<img height="10" width="20" src="${(0, utils_1.getCountryFlagByNationality)(this, result.Driver.nationality)}">&nbsp;` : '')}${(0, utils_1.getDriverName)(result.Driver, this.config)}</td>
                ${(((_b = this.config.standings) === null || _b === void 0 ? void 0 : _b.show_team) ? (0, lit_html_1.html) `${(0, utils_1.renderConstructorColumn)(this, result.Constructor)}` : '')}
                <td>${result.Q1}</td>
                <td>${result.Q2}</td>
                <td>${result.Q3}</td>
            </tr>`;
    }
    renderHeader(race) {
        if (race === null || race === undefined || parseInt(race.season) < 2018) {
            return null;
        }
        return (0, utils_1.renderHeader)(this, race);
    }
    render() {
        const { races, selectedRace, selectedSeason, selectedTabIndex } = this.getProperties();
        if (selectedSeason === undefined) {
            this.getLastResult();
        }
        const selectedSeasonChanged = (ev) => {
            this.setRaces(ev);
        };
        const selectedRaceChanged = (ev) => {
            this.setSelectedRace(ev);
        };
        const tabs = this.renderTabs(selectedRace);
        return (0, lit_html_1.html) `
        <table>
            <tr>
                <td> 
                    ${this.translation('seasonheader')}<br />                      
                    ${(0, until_js_1.until)(this.client.GetSeasons().then(response => {
            const seasons = response.reverse();
            return (0, lit_html_1.html) `<select name="selectedSeason" @change="${selectedSeasonChanged}">
                                        <option value="0">${this.translation('selectseason')}</option>
                                        ${seasons.map(season => {
                return (0, lit_html_1.html) `<option value="${season.season}" ?selected=${selectedSeason === season.season}>${season.season}</option>`;
            })}
                                    </select>`;
        }).catch(() => {
            return (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('seasons')}`;
        }), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}                 
                </td>
                <td>
                    ${this.translation('raceheader')}<br />
                    <select name="selectedRace" @change="${selectedRaceChanged}">
                        <option value="0" ?selected=${selectedRace === undefined}>${this.translation('selectrace')}</option>
                        ${races === null || races === void 0 ? void 0 : races.map(race => {
            return (0, lit_html_1.html) `<option value="${race.round}" ?selected=${(selectedRace === null || selectedRace === void 0 ? void 0 : selectedRace.round) == race.round}>${race.raceName}</option>`;
        })}
                    </select>
                </td>
            </tr>
        </table>
        ${this.renderTabsHtml(tabs, selectedTabIndex, selectedRace)}`;
    }
    setSelectedRace(ev) {
        const round = parseInt(ev.target.value);
        const { properties, cardValues } = this.getParentCardValues();
        properties.selectedRound = round;
        const selectedSeason = properties.selectedSeason;
        Promise.all([this.client.GetResults(selectedSeason, round),
            this.client.GetQualifyingResults(selectedSeason, round),
            this.client.GetSprintResults(selectedSeason, round),
            this.client.GetSchedule(selectedSeason)])
            .then(([results, qualifyingResults, sprintResults, schedule]) => {
            var _a;
            let race = results.Races[0];
            if (race) {
                race.QualifyingResults = qualifyingResults.Races[0].QualifyingResults;
                race.SprintResults = (_a = sprintResults === null || sprintResults === void 0 ? void 0 : sprintResults.Races[0]) === null || _a === void 0 ? void 0 : _a.SprintResults;
                properties.selectedSeason = race.season;
            }
            else {
                race = schedule.filter(item => parseInt(item.round) == round)[0];
            }
            properties.selectedRace = race;
            cardValues.set('cardValues', properties);
            this.parent.properties = cardValues;
        });
    }
    setRaces(ev) {
        const selectedSeason = ev.target.value;
        const { properties, cardValues } = this.getParentCardValues();
        this.client.GetSeasonRaces(parseInt(selectedSeason)).then(response => {
            properties.selectedSeason = selectedSeason;
            properties.selectedRace = undefined;
            properties.races = response;
            cardValues.set('cardValues', properties);
            this.parent.properties = cardValues;
        });
    }
    getUpcomingRace(now, races) {
        const nextRaces = races.filter(race => {
            const raceDateTime = new Date(race.date + 'T' + race.time);
            const qualifyingDateTime = new Date(race.Qualifying.date + 'T' + race.Qualifying.time);
            const sprintDateTime = race.Sprint ? new Date(race.Sprint.date + 'T' + race.Sprint.time) : null;
            if (raceDateTime >= now && (qualifyingDateTime < now && (sprintDateTime === null || sprintDateTime < now))) {
                return true;
            }
            return false;
        });
        return nextRaces.length > 0 ? nextRaces[0] : null;
    }
    getLastResult() {
        const now = new Date();
        Promise.all([this.client.GetSchedule(now.getFullYear()), this.client.GetLastResult()])
            .then(([schedule, lastResult]) => {
            const upcomingRace = this.getUpcomingRace(now, schedule);
            let season = new Date().getFullYear();
            let round = upcomingRace !== null ? parseInt(upcomingRace.round) : 0;
            let race = {};
            if (upcomingRace !== null) {
                race = upcomingRace;
                round = parseInt(race.round);
                season = parseInt(race.season);
            }
            else {
                race = lastResult;
                round = parseInt(lastResult.round);
                season = parseInt(lastResult.season);
            }
            Promise.all([this.client.GetQualifyingResults(season, round),
                this.client.GetSprintResults(season, round),
                this.client.GetSeasonRaces(season)])
                .then(([qualifyingResults, sprintResults, seasonRaces]) => {
                var _a;
                const { properties, cardValues } = this.getParentCardValues();
                race.QualifyingResults = qualifyingResults.Races[0].QualifyingResults;
                race.SprintResults = (_a = sprintResults.Races[0]) === null || _a === void 0 ? void 0 : _a.SprintResults;
                properties.races = seasonRaces;
                properties.selectedRace = race;
                properties.selectedSeason = season.toString();
                cardValues.set('cardValues', properties);
                this.parent.properties = cardValues;
            });
        });
    }
    setSelectedTabIndex(index) {
        const { properties, cardValues } = this.getParentCardValues();
        properties.selectedTabIndex = index;
        cardValues.set('cardValues', properties);
        this.parent.properties = cardValues;
    }
    icon(key) {
        if (!this.config.icons || Object.keys(this.config.icons).indexOf(key) < 0) {
            return this.icons[key];
        }
        return this.config.icons[key];
    }
    tabOrder(tab) {
        var _a, _b;
        const tabsOrder = (_b = (_a = this.config.tabs_order) === null || _a === void 0 ? void 0 : _a.map(tab => tab.toLowerCase())) !== null && _b !== void 0 ? _b : ['results', 'qualifying', 'sprint'];
        return tabsOrder.indexOf(tab);
    }
}
exports["default"] = Results;


/***/ }),

/***/ 6496:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const custom_card_helpers_1 = __webpack_require__(6197);
const lit_html_1 = __webpack_require__(3692);
const until_js_1 = __webpack_require__(7345);
const format_date_1 = __webpack_require__(3247);
const formulaone_card_types_1 = __webpack_require__(9098);
const utils_1 = __webpack_require__(8593);
const base_card_1 = __webpack_require__(5243);
class Schedule extends base_card_1.BaseCard {
    constructor(parent) {
        super(parent);
        this.defaultTranslations = {
            'date': 'Date',
            'race': 'Race',
            'time': 'Time',
            'location': 'Location',
            'endofseason': 'Season is over. See you next year!'
        };
    }
    cardSize() {
        return 12;
    }
    renderLocation(circuit) {
        var _a;
        const locationConcatted = (0, lit_html_1.html) `${(((_a = this.config.standings) === null || _a === void 0 ? void 0 : _a.show_flag) ? (0, lit_html_1.html) `<img height="10" width="20" src="${(0, utils_1.getCountryFlagByName)(this, circuit.Location.country)}">&nbsp;` : '')}${circuit.Location.locality}, ${circuit.Location.country}`;
        return this.config.location_clickable ? (0, lit_html_1.html) `<a href="${circuit.url}" target="_blank">${locationConcatted}</a>` : locationConcatted;
    }
    renderScheduleRow(race) {
        const raceDate = new Date(race.date + 'T' + race.time);
        const renderClass = this.config.previous_race && raceDate < new Date() ? this.config.previous_race : '';
        return (0, lit_html_1.html) `
            <tr class="${renderClass}">
                <td class="width-50 text-center">${race.round}</td>
                <td>${race.Circuit.circuitName}</td>
                <td>${this.renderLocation(race.Circuit)}</td>
                <td class="width-60 text-center">${(0, format_date_1.formatDate)(raceDate, this.hass.locale, this.config.date_locale)}</td>
                <td class="width-50 text-center">${(0, custom_card_helpers_1.formatTime)(raceDate, this.hass.locale)}</td>
            </tr>`;
    }
    render() {
        return (0, lit_html_1.html) `${(0, until_js_1.until)(this.client.GetSchedule(new Date().getFullYear()).then(response => {
            const schedule = this.config.previous_race === formulaone_card_types_1.PreviousRaceDisplay.Hide ? response.filter(race => {
                return new Date(race.date + 'T' + race.time) >= new Date();
            }) : response;
            const next_race = schedule.filter(race => {
                return new Date(race.date + 'T' + race.time) >= new Date();
            })[0];
            if (!next_race) {
                return (0, utils_1.getEndOfSeasonMessage)(this.translation('endofseason'));
            }
            return (0, lit_html_1.html) `<table>
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>${this.translation('race')}</th>
                                    <th>${this.translation('location')}</th>
                                    <th class="text-center">${this.translation('date')}</th>
                                    <th class="text-center">${this.translation('time')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(0, utils_1.reduceArray)(schedule, this.config.row_limit).map(race => this.renderScheduleRow(race))}
                            </tbody>
                        </table>`;
        }).catch(() => {
            return (0, lit_html_1.html) `${(0, utils_1.getApiErrorMessage)('schedule')}`;
        }), (0, lit_html_1.html) `${(0, utils_1.getApiLoadingMessage)()}`)}`;
    }
}
exports["default"] = Schedule;


/***/ }),

/***/ 4312:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CARD_EDITOR_NAME = exports.CARD_NAME = void 0;
exports.CARD_NAME = 'formulaone-card';
exports.CARD_EDITOR_NAME = `${exports.CARD_NAME}-editor`;


/***/ }),

/***/ 8342:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.actionHandler = exports.actionHandlerBind = void 0;
const lit_1 = __webpack_require__(6370);
const directive_js_1 = __webpack_require__(8082);
const custom_card_helpers_1 = __webpack_require__(6197);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0;
class ActionHandler extends HTMLElement {
    constructor() {
        super();
        this.holdTime = 500;
        this.held = false;
        this.ripple = document.createElement('mwc-ripple');
    }
    connectedCallback() {
        Object.assign(this.style, {
            position: 'absolute',
            width: isTouch ? '100px' : '50px',
            height: isTouch ? '100px' : '50px',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: '999',
        });
        this.appendChild(this.ripple);
        this.ripple.primary = true;
        ['touchcancel', 'mouseout', 'mouseup', 'touchmove', 'mousewheel', 'wheel', 'scroll'].forEach((ev) => {
            document.addEventListener(ev, () => {
                clearTimeout(this.timer);
                this.stopAnimation();
                this.timer = undefined;
            }, { passive: true });
        });
    }
    bind(element, options) {
        if (element.actionHandler) {
            return;
        }
        element.actionHandler = true;
        element.addEventListener('contextmenu', (ev) => {
            const e = ev || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        });
        const start = (ev) => {
            this.held = false;
            let x;
            let y;
            if (ev.touches) {
                x = ev.touches[0].pageX;
                y = ev.touches[0].pageY;
            }
            else {
                x = ev.pageX;
                y = ev.pageY;
            }
            this.timer = window.setTimeout(() => {
                this.startAnimation(x, y);
                this.held = true;
            }, this.holdTime);
        };
        const end = (ev) => {
            ev.preventDefault();
            if (['touchend', 'touchcancel'].includes(ev.type) && this.timer === undefined) {
                return;
            }
            clearTimeout(this.timer);
            this.stopAnimation();
            this.timer = undefined;
            if (this.held) {
                (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'hold' });
            }
            else if (options.hasDoubleClick) {
                if ((ev.type === 'click' && ev.detail < 2) || !this.dblClickTimeout) {
                    this.dblClickTimeout = window.setTimeout(() => {
                        this.dblClickTimeout = undefined;
                        (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'tap' });
                    }, 250);
                }
                else {
                    clearTimeout(this.dblClickTimeout);
                    this.dblClickTimeout = undefined;
                    (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'double_tap' });
                }
            }
            else {
                (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'tap' });
            }
        };
        const handleEnter = (ev) => {
            if (ev.keyCode !== 13) {
                return;
            }
            end(ev);
        };
        element.addEventListener('touchstart', start, { passive: true });
        element.addEventListener('touchend', end);
        element.addEventListener('touchcancel', end);
        element.addEventListener('mousedown', start, { passive: true });
        element.addEventListener('click', end);
        element.addEventListener('keyup', handleEnter);
    }
    startAnimation(x, y) {
        Object.assign(this.style, {
            left: `${x}px`,
            top: `${y}px`,
            display: null,
        });
        this.ripple.disabled = false;
        this.ripple.active = true;
        this.ripple.unbounded = true;
    }
    stopAnimation() {
        this.ripple.active = false;
        this.ripple.disabled = true;
        this.style.display = 'none';
    }
}
customElements.define('action-handler-formulaonecard', ActionHandler);
const getActionHandler = () => {
    const body = document.body;
    if (body.querySelector('action-handler-formulaonecard')) {
        return body.querySelector('action-handler-formulaonecard');
    }
    const actionhandler = document.createElement('action-handler-formulaonecard');
    body.appendChild(actionhandler);
    return actionhandler;
};
const actionHandlerBind = (element, options) => {
    const actionhandler = getActionHandler();
    if (!actionhandler) {
        return;
    }
    actionhandler.bind(element, options);
};
exports.actionHandlerBind = actionHandlerBind;
exports.actionHandler = (0, directive_js_1.directive)(class extends directive_js_1.Directive {
    update(part, [options]) {
        (0, exports.actionHandlerBind)(part.element, options);
        return lit_1.noChange;
    }
    render(_options) { }
});


/***/ }),

/***/ 1384:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormulaOneCardEditor = void 0;
const lit_1 = __webpack_require__(6370);
const lit_html_1 = __webpack_require__(3692);
const decorators_js_1 = __webpack_require__(9662);
const consts_1 = __webpack_require__(4312);
const formulaone_card_types_1 = __webpack_require__(9098);
const ha_editor_formbuilder_1 = __webpack_require__(8455);
const interfaces_1 = __webpack_require__(7399);
let FormulaOneCardEditor = class FormulaOneCardEditor extends ha_editor_formbuilder_1.default {
    render() {
        if (!this._hass || !this._config) {
            return (0, lit_html_1.html) ``;
        }
        return this.renderForm([
            { controls: [{ label: "Card Type (Required)", configValue: "card_type", type: interfaces_1.FormControlType.Dropdown, items: this.getDropdownOptionsFromEnum(formulaone_card_types_1.FormulaOneCardType) }] },
            { controls: [{ label: "Title", configValue: "title", type: interfaces_1.FormControlType.Textbox }] },
            {
                label: "Basic configuration",
                cssClass: 'side-by-side',
                controls: [
                    { label: "Use F1 font", configValue: "f1_font", type: interfaces_1.FormControlType.Switch },
                    { label: "Image clickable", configValue: "image_clickable", type: interfaces_1.FormControlType.Switch },
                    { label: "Show carnumber", configValue: "show_carnumber", type: interfaces_1.FormControlType.Switch },
                    { label: "Location clickable", configValue: "location_clickable", type: interfaces_1.FormControlType.Switch },
                    { label: "Show race information", configValue: "show_raceinfo", type: interfaces_1.FormControlType.Switch },
                    { label: "Hide track layout", configValue: "hide_tracklayout", type: interfaces_1.FormControlType.Switch },
                    { label: "Hide race dates and times", configValue: "hide_racedatetimes", type: interfaces_1.FormControlType.Switch },
                    { label: "Show last years result", configValue: "show_lastyears_result", type: interfaces_1.FormControlType.Switch },
                    { label: "Only show date", configValue: "only_show_date", type: interfaces_1.FormControlType.Switch }
                ]
            },
            {
                label: "Countdown Type",
                cssClass: 'side-by-side',
                controls: [{ configValue: "countdown_type", type: interfaces_1.FormControlType.Checkboxes, items: this.getDropdownOptionsFromEnum(formulaone_card_types_1.CountdownType) }]
            },
            {
                cssClass: 'side-by-side',
                controls: [
                    { label: "Next race delay", configValue: "next_race_delay", type: interfaces_1.FormControlType.Textbox },
                    { label: "Row limit", configValue: "row_limit", type: interfaces_1.FormControlType.Textbox },
                ]
            },
            { controls: [{ label: "Previous race", configValue: "previous_race", type: interfaces_1.FormControlType.Dropdown, items: this.getDropdownOptionsFromEnum(formulaone_card_types_1.PreviousRaceDisplay) }] },
            {
                label: "Standings",
                cssClass: 'side-by-side',
                controls: [
                    { label: "Show team", configValue: "standings.show_team", type: interfaces_1.FormControlType.Switch },
                    { label: "Show flag", configValue: "standings.show_flag", type: interfaces_1.FormControlType.Switch },
                    { label: "Show teamlogo", configValue: "standings.show_teamlogo", type: interfaces_1.FormControlType.Switch }
                ]
            },
        ]);
    }
    static get styles() {
        return (0, lit_1.css) `
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
        `;
    }
};
FormulaOneCardEditor = __decorate([
    (0, decorators_js_1.customElement)(consts_1.CARD_EDITOR_NAME)
], FormulaOneCardEditor);
exports.FormulaOneCardEditor = FormulaOneCardEditor;


/***/ }),

/***/ 2169:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadCustomFonts = void 0;
const loadCustomFonts = () => {
    if (window && document.fonts) {
        const font = new FontFace("F1Bold", "url(https://www.formula1.com/etc/designs/fom-website/fonts/F1Bold/Formula1-Bold.woff)");
        document.fonts.add(font);
        font.load();
    }
};
exports.loadCustomFonts = loadCustomFonts;


/***/ }),

/***/ 3607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const packageJson = __webpack_require__(4147);
const decorators_js_1 = __webpack_require__(9662);
const formulaone_card_types_1 = __webpack_require__(9098);
const lit_1 = __webpack_require__(6370);
const utils_1 = __webpack_require__(8593);
const fonts_1 = __webpack_require__(2169);
const styles_1 = __webpack_require__(4299);
const constructor_standings_1 = __webpack_require__(6521);
const driver_standings_1 = __webpack_require__(9412);
const schedule_1 = __webpack_require__(6496);
const next_race_1 = __webpack_require__(1249);
const last_result_1 = __webpack_require__(1958);
const countdown_1 = __webpack_require__(2765);
const results_1 = __webpack_require__(5903);
const restcountry_client_1 = __webpack_require__(2930);
const consts_1 = __webpack_require__(4312);
console.info(`%c ${consts_1.CARD_NAME.toUpperCase()} %c ${packageJson.version}`, 'color: cyan; background: black; font-weight: bold;', 'color: darkblue; background: white; font-weight: bold;');
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'formulaone-card',
    name: 'FormulaOne card',
    preview: false,
    description: 'Present the data of Formula One in a pretty way',
});
let FormulaOneCard = class FormulaOneCard extends lit_1.LitElement {
    set properties(values) {
        this._cardValues = values;
        this.update(values);
    }
    get properties() {
        return this._cardValues;
    }
    constructor() {
        super();
        this.setCountryCache();
    }
    static getConfigElement() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve().then(() => __webpack_require__(1384));
            return document.createElement(consts_1.CARD_EDITOR_NAME);
        });
    }
    setConfig(config) {
        (0, utils_1.checkConfig)(config);
        this.config = Object.assign({}, config);
    }
    setCountryCache() {
        new restcountry_client_1.default().GetAll().catch(() => {
            this.warning = 'Country API is down, so flags are not available at the moment!';
            this.update(this._cardValues);
        });
    }
    shouldUpdate(changedProps) {
        return (0, utils_1.hasConfigOrCardValuesChanged)(this, changedProps);
    }
    set hass(hass) {
        this._hass = hass;
        this.config.hass = hass;
        switch (this.config.card_type) {
            case formulaone_card_types_1.FormulaOneCardType.ConstructorStandings:
                this.card = new constructor_standings_1.default(this);
                break;
            case formulaone_card_types_1.FormulaOneCardType.DriverStandings:
                this.card = new driver_standings_1.default(this);
                break;
            case formulaone_card_types_1.FormulaOneCardType.Schedule:
                this.card = new schedule_1.default(this);
                break;
            case formulaone_card_types_1.FormulaOneCardType.NextRace:
                this.card = new next_race_1.default(this);
                break;
            case formulaone_card_types_1.FormulaOneCardType.LastResult:
                this.card = new last_result_1.default(this);
                break;
            case formulaone_card_types_1.FormulaOneCardType.Countdown:
                this.card = new countdown_1.default(this);
                break;
            case formulaone_card_types_1.FormulaOneCardType.Results:
                this.card = new results_1.default(this);
                break;
        }
    }
    static get styles() {
        (0, fonts_1.loadCustomFonts)();
        return styles_1.styles;
    }
    render() {
        if (!this._hass || !this.config)
            return (0, lit_1.html) ``;
        try {
            return (0, lit_1.html) `
                <ha-card elevation="2">
                    ${this.warning ? (0, lit_1.html) `<hui-warning>${this.warning}</hui-warning>` : ''}
                    ${this.config.title ? (0, lit_1.html) `<h1 class="card-header${(this.config.f1_font ? ' formulaone-font' : '')}">${this.config.title}</h1>` : ''}
                    ${this.card.render()}
                </ha-card>
            `;
        }
        catch (error) {
            return (0, lit_1.html) `<hui-warning>${error.toString()}</hui-warning>`;
        }
    }
    getCardSize() {
        return this.card.cardSize();
    }
};
__decorate([
    (0, decorators_js_1.property)()
], FormulaOneCard.prototype, "_hass", void 0);
__decorate([
    (0, decorators_js_1.property)()
], FormulaOneCard.prototype, "config", void 0);
__decorate([
    (0, decorators_js_1.property)()
], FormulaOneCard.prototype, "card", void 0);
__decorate([
    (0, decorators_js_1.property)()
], FormulaOneCard.prototype, "warning", void 0);
__decorate([
    (0, decorators_js_1.property)()
], FormulaOneCard.prototype, "properties", null);
FormulaOneCard = __decorate([
    (0, decorators_js_1.customElement)(consts_1.CARD_NAME)
], FormulaOneCard);
exports["default"] = FormulaOneCard;


/***/ }),

/***/ 5623:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeFormat = exports.NumberFormat = exports.SECONDARY_INFO_VALUES = exports.TIMESTAMP_FORMATS = exports.ImageConstants = void 0;
exports.ImageConstants = {
    FlagCDN: 'https://flagcdn.com/w320/',
    TeamLogoCDN: 'https://www.formula1.com/content/dam/fom-website/teams/',
    F1CDN: 'https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/',
};
exports.TIMESTAMP_FORMATS = ['relative', 'total', 'date', 'time', 'datetime'];
exports.SECONDARY_INFO_VALUES = [
    'entity-id',
    'last-changed',
    'last-updated',
    'last-triggered',
    'position',
    'tilt-position',
    'brightness',
];
exports.NumberFormat = {
    language: 'language',
    system: 'system',
    comma_decimal: 'comma_decimal',
    decimal_comma: 'decimal_comma',
    space_comma: 'space_comma',
    none: 'none',
};
exports.TimeFormat = {
    language: 'language',
    system: 'system',
    am_pm: '12',
    twenty_four: '24',
};


/***/ }),

/***/ 3247:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatDateNumeric = exports.formatDate = void 0;
const formatDate = (dateObj, locale, overrideLanguage) => new Intl.DateTimeFormat(overrideLanguage !== null && overrideLanguage !== void 0 ? overrideLanguage : locale.language, {
    month: '2-digit',
    day: '2-digit',
}).format(dateObj);
exports.formatDate = formatDate;
const formatDateNumeric = (dateObj, locale, overrideLanguage) => new Intl.DateTimeFormat(overrideLanguage !== null && overrideLanguage !== void 0 ? overrideLanguage : locale.language, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
}).format(dateObj);
exports.formatDateNumeric = formatDateNumeric;


/***/ }),

/***/ 4347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatDateTimeRaceInfo = exports.formatDateTime = void 0;
const use_am_pm_1 = __webpack_require__(2269);
const formatDateTime = (dateObj, locale) => new Intl.DateTimeFormat(locale.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: (0, use_am_pm_1.useAmPm)(locale) ? 'numeric' : '2-digit',
    minute: '2-digit',
    hour12: (0, use_am_pm_1.useAmPm)(locale),
}).format(dateObj);
exports.formatDateTime = formatDateTime;
const formatDateTimeRaceInfo = (dateObj, locale) => new Intl.DateTimeFormat(locale.language, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: (0, use_am_pm_1.useAmPm)(locale),
}).format(dateObj);
exports.formatDateTimeRaceInfo = formatDateTimeRaceInfo;


/***/ }),

/***/ 2269:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useAmPm = void 0;
const constants_1 = __webpack_require__(5623);
const useAmPm = (locale) => {
    if (locale.time_format === constants_1.TimeFormat.language || locale.time_format === constants_1.TimeFormat.system) {
        const testLanguage = locale.time_format === constants_1.TimeFormat.language ? locale.language : undefined;
        const test = new Date().toLocaleString(testLanguage);
        return test.includes('AM') || test.includes('PM');
    }
    return locale.time_format === constants_1.TimeFormat.am_pm;
};
exports.useAmPm = useAmPm;


/***/ }),

/***/ 4299:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.styles = void 0;
const lit_1 = __webpack_require__(6370);
exports.styles = (0, lit_1.css) `   
    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: separate;
        padding: 0px 16px 16px;
    }
    table.nopadding {
        padding: 0px;
        width: 100%;
        border-spacing: 0;
        border-collapse: separate;
    }
    th {
        background-color: var(--table-row-alternative-background-color, #eee);
    }
    th, td {
        padding: 5px;
        text-align: left;
    }
    tr {
        color: var(--secondary-text-color);
    }
    tr:nth-child(even) {
        background-color: var(--table-row-alternative-background-color, #eee);
    }
    .text-center {
        text-align: center;
    }
    .width-40 {
        width: 40px;
    }
    .width-50 {
        width: 50px;
    }
    .width-60 {
        width: 60px;
    }
    .hide {
        display: none;
    }
    .strikethrough {
        text-decoration: line-through;
    }
    .italic {
        font-style: italic;
    }
    a {
        text-decoration: none;
        color: var(--secondary-text-color);
    }
    .constructor-logo {
        width: 20px;
        margin: auto;
        display: block;
        float: left;
        background-color: white;
        border-radius: 50%;
        margin-right: 3px;
    }
    .clickable {
        cursor: pointer;
    }
    .formulaone-font {
        font-family: 'F1Bold';
    }
    ha-icon {
        color: var(--secondary-text-color);
    }
    .transparent {
        background-color: transparent !important;
    }        
    .weather-info {
        padding: 10px;
    }

    .weather-info td {
        width: 33%;
    }
`;


/***/ }),

/***/ 9098:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormulaOneCardType = exports.PreviousRaceDisplay = exports.CountdownType = exports.WeatherUnit = void 0;
var WeatherUnit;
(function (WeatherUnit) {
    WeatherUnit["Metric"] = "metric";
    WeatherUnit["MilesCelsius"] = "uk";
    WeatherUnit["MilesFahrenheit"] = "us";
})(WeatherUnit = exports.WeatherUnit || (exports.WeatherUnit = {}));
var CountdownType;
(function (CountdownType) {
    CountdownType["Race"] = "race";
    CountdownType["Qualifying"] = "qualifying";
    CountdownType["Practice1"] = "practice1";
    CountdownType["Practice2"] = "practice2";
    CountdownType["Practice3"] = "practice3";
    CountdownType["Sprint"] = "sprint";
})(CountdownType = exports.CountdownType || (exports.CountdownType = {}));
var PreviousRaceDisplay;
(function (PreviousRaceDisplay) {
    PreviousRaceDisplay["Strikethrough"] = "strikethrough";
    PreviousRaceDisplay["Italic"] = "italic";
    PreviousRaceDisplay["Hide"] = "hide";
})(PreviousRaceDisplay = exports.PreviousRaceDisplay || (exports.PreviousRaceDisplay = {}));
var FormulaOneCardType;
(function (FormulaOneCardType) {
    FormulaOneCardType["DriverStandings"] = "driver_standings";
    FormulaOneCardType["ConstructorStandings"] = "constructor_standings";
    FormulaOneCardType["NextRace"] = "next_race";
    FormulaOneCardType["Schedule"] = "schedule";
    FormulaOneCardType["LastResult"] = "last_result";
    FormulaOneCardType["Results"] = "results";
    FormulaOneCardType["Countdown"] = "countdown";
})(FormulaOneCardType = exports.FormulaOneCardType || (exports.FormulaOneCardType = {}));


/***/ }),

/***/ 8593:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderConstructorColumn = exports.reduceArray = exports.getRefreshTime = exports.calculateWindDirection = exports.renderWeatherInfo = exports.renderLastYearsResults = exports.renderRaceInfo = exports.renderHeader = exports.clickHandler = exports.getEndOfSeasonMessage = exports.getApiLoadingMessage = exports.getApiErrorMessage = exports.getDriverName = exports.getCircuitName = exports.getTeamImage = exports.checkConfig = exports.getCountryFlagByName = exports.getCountryFlagByNationality = exports.getCountries = exports.hasConfigOrCardValuesChanged = void 0;
const lit_1 = __webpack_require__(6370);
const formulaone_card_types_1 = __webpack_require__(9098);
const format_date_time_1 = __webpack_require__(4347);
const custom_card_helpers_1 = __webpack_require__(6197);
const format_date_1 = __webpack_require__(3247);
const constants_1 = __webpack_require__(5623);
const action_handler_directive_1 = __webpack_require__(8342);
const restcountry_client_1 = __webpack_require__(2930);
const until_js_1 = __webpack_require__(7345);
const hasConfigOrCardValuesChanged = (node, changedProps) => {
    if (changedProps.has('config')) {
        return true;
    }
    const card = changedProps.get('card');
    if (card && card.parent) {
        return card.parent.properties !== node.properties;
    }
    const cardValues = changedProps.get('cardValues');
    if (cardValues) {
        return cardValues != node.properties;
    }
    return false;
};
exports.hasConfigOrCardValuesChanged = hasConfigOrCardValuesChanged;
const getCountries = () => {
    const countryClient = new restcountry_client_1.default();
    return countryClient.GetCountriesFromLocalStorage();
};
exports.getCountries = getCountries;
const getCountryFlagByNationality = (card, nationality) => {
    const countries = (0, exports.getCountries)();
    const country = countries.filter(x => x.demonym == nationality);
    if (country.length > 1) {
        return card.imageClient.GetImage(country.sort((a, b) => (a.population > b.population) ? -1 : 1)[0].flags.png);
    }
    return card.imageClient.GetImage(country[0].flags.png);
};
exports.getCountryFlagByNationality = getCountryFlagByNationality;
const getCountryFlagByName = (card, countryName) => {
    const countries = (0, exports.getCountries)();
    const country = countries.filter(x => {
        var _a;
        return x.name == countryName || x.nativeName == countryName ||
            ((_a = x.altSpellings) === null || _a === void 0 ? void 0 : _a.includes(countryName));
    })[0];
    return card.imageClient.GetImage(country.flags.png);
};
exports.getCountryFlagByName = getCountryFlagByName;
const checkConfig = (config) => {
    if (config.card_type === undefined) {
        throw new Error('Please define FormulaOne card type (card_type).');
    }
};
exports.checkConfig = checkConfig;
const getTeamImage = (card, teamName) => {
    teamName = teamName.toLocaleLowerCase().replace('_', '-');
    const exceptions = [{ teamName: 'red-bull', corrected: 'red-bull-racing' }, { teamName: 'alfa', corrected: 'alfa-romeo' }, { teamName: 'haas', corrected: 'haas-f1-team' }];
    const exception = exceptions.filter(exception => exception.teamName == teamName);
    if (exception.length > 0) {
        teamName = exception[0].corrected;
    }
    return card.imageClient.GetImage(`${constants_1.ImageConstants.TeamLogoCDN}/2023/${teamName.toLowerCase()}-logo.png.transform/2col-retina/image.png`);
};
exports.getTeamImage = getTeamImage;
const getCircuitName = (location) => {
    let circuitName = location.country.replace(" ", "-");
    const exceptions = [{ countryDashed: 'UAE', name: 'Abu_Dhabi' }, { countryDashed: 'UK', name: 'Great_Britain' },
        { countryDashed: 'Monaco', name: 'Monoco' }, { countryDashed: 'Azerbaijan', name: 'Baku' }, { countryDashed: 'Saudi-Arabia', name: 'Saudi_Arabia' }];
    const exception = exceptions.filter(exception => exception.countryDashed == circuitName);
    if (exception.length > 0) {
        circuitName = exception[0].name;
    }
    if (location.country == 'USA' && location.locality != 'Austin') {
        circuitName = location.locality;
    }
    if (location.country == 'Italy' && location.locality == 'Imola') {
        circuitName = "Emilia_Romagna";
    }
    return circuitName;
};
exports.getCircuitName = getCircuitName;
const getDriverName = (driver, config) => {
    const permanentNumber = driver.code == 'VER' ? 1 : driver.permanentNumber;
    return `${driver.givenName} ${driver.familyName}${(config.show_carnumber ? ` #${permanentNumber}` : '')}`;
};
exports.getDriverName = getDriverName;
const getApiErrorMessage = (dataType) => {
    return (0, lit_1.html) `<table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting ${dataType} <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table>`;
};
exports.getApiErrorMessage = getApiErrorMessage;
const getApiLoadingMessage = () => {
    return (0, lit_1.html) `<table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table>`;
};
exports.getApiLoadingMessage = getApiLoadingMessage;
const getEndOfSeasonMessage = (message) => {
    return (0, lit_1.html) `<table><tr><td class="text-center"><ha-icon icon="mdi:flag-checkered"></ha-icon><strong>${message}</strong><ha-icon icon="mdi:flag-checkered"></ha-icon></td></tr></table>`;
};
exports.getEndOfSeasonMessage = getEndOfSeasonMessage;
const clickHandler = (node, config, hass, ev) => {
    (0, custom_card_helpers_1.handleAction)(node, hass, config.actions, ev.detail.action);
};
exports.clickHandler = clickHandler;
const renderHeader = (card, race, preventClick = false) => {
    var _a, _b;
    const circuitName = (0, exports.getCircuitName)(race.Circuit.Location);
    const _handleAction = (ev) => {
        if (card.hass && card.config.actions && ev.detail.action && !preventClick) {
            (0, exports.clickHandler)(card.parent, card.config, card.hass, ev);
        }
    };
    const hasConfigAction = card.config.image_clickable || card.config.actions !== undefined;
    const circuitUrl = race.Circuit.url;
    if (card.config.image_clickable && !card.config.actions) {
        card.config.actions = {
            tap_action: {
                action: 'url',
                url_path: circuitUrl
            }
        };
    }
    const imageHtml = (0, lit_1.html) `<img width="100%" src="${card.imageClient.GetImage(`${constants_1.ImageConstants.F1CDN}Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png`)}" @action=${_handleAction}
    .actionHandler=${(0, action_handler_directive_1.actionHandler)({
        hasHold: (0, custom_card_helpers_1.hasAction)((_a = card.config.actions) === null || _a === void 0 ? void 0 : _a.hold_action),
        hasDoubleClick: (0, custom_card_helpers_1.hasAction)((_b = card.config.actions) === null || _b === void 0 ? void 0 : _b.double_tap_action),
    })} class="${(hasConfigAction ? ' clickable' : null)}" />`;
    const raceName = (0, lit_1.html) `<h2 class="${(card.config.f1_font ? 'formulaone-font' : '')}"><img height="25" src="${(0, exports.getCountryFlagByName)(card, race.Circuit.Location.country)}">&nbsp;  ${race.round} :  ${race.raceName}</h2>`;
    return (0, lit_1.html) `${(card.config.card_type == formulaone_card_types_1.FormulaOneCardType.Countdown ? (0, lit_1.html) `` : raceName)} ${(card.config.hide_tracklayout ? (0, lit_1.html) `` : imageHtml)}<br>`;
};
exports.renderHeader = renderHeader;
const renderRaceInfo = (card, race, raceDateTime) => {
    var _a;
    const config = card.config;
    const hass = card.hass;
    if (config.hide_racedatetimes) {
        return (0, lit_1.html) ``;
    }
    const configWeatherApi = config.show_weather && ((_a = config.weather_options) === null || _a === void 0 ? void 0 : _a.api_key) !== undefined;
    const weatherPromise = configWeatherApi ? card.weatherClient.getWeatherData(race.Circuit.Location.lat, race.Circuit.Location.long, `${race.date}T${race.time}`) : Promise.resolve(null);
    const lastYearPromise = config.show_lastyears_result ? card.client.GetLastYearsResults(race.Circuit.circuitName) : Promise.resolve(null);
    const promises = Promise.all([weatherPromise, lastYearPromise]);
    return (0, lit_1.html) `${(0, until_js_1.until)(promises.then(([weather, lastYearData]) => {
        const weatherData = weather === null || weather === void 0 ? void 0 : weather.days[0];
        const raceDate = new Date(race.date + 'T' + race.time);
        const weatherInfo = (0, exports.renderWeatherInfo)(weatherData, config, raceDateTime !== null && raceDateTime !== void 0 ? raceDateTime : raceDate);
        const lastYearsResult = (0, exports.renderLastYearsResults)(config, lastYearData);
        const freePractice1 = (0, format_date_time_1.formatDateTimeRaceInfo)(new Date(race.FirstPractice.date + 'T' + race.FirstPractice.time), hass.locale);
        const freePractice2 = (0, format_date_time_1.formatDateTimeRaceInfo)(new Date(race.SecondPractice.date + 'T' + race.SecondPractice.time), hass.locale);
        const freePractice3 = race.ThirdPractice !== undefined ? (0, format_date_time_1.formatDateTimeRaceInfo)(new Date(race.ThirdPractice.date + 'T' + race.ThirdPractice.time), hass.locale) : '-';
        const raceDateFormatted = (0, format_date_time_1.formatDateTimeRaceInfo)(raceDate, hass.locale);
        const qualifyingDate = (0, format_date_time_1.formatDateTimeRaceInfo)(new Date(race.Qualifying.date + 'T' + race.Qualifying.time), hass.locale);
        const sprintDate = race.Sprint !== undefined ? (0, format_date_time_1.formatDateTimeRaceInfo)(new Date(race.Sprint.date + 'T' + race.Sprint.time), hass.locale) : '-';
        return (0, lit_1.html) `${lastYearsResult}${weatherInfo}<tr><td>${card.translation('date')}</td><td>${(0, format_date_1.formatDateNumeric)(raceDate, hass.locale, config.date_locale)}</td><td>&nbsp;</td><td>${card.translation('practice1')}</td><td align="right">${freePractice1}</td></tr>
                    <tr><td>${card.translation('race')}</td><td>${race.round}</td><td>&nbsp;</td><td>${card.translation('practice2')}</td><td align="right">${freePractice2}</td></tr>
                    <tr><td>${card.translation('racename')}</td><td>${race.raceName}</td><td>&nbsp;</td><td>${card.translation('practice3')}</td><td align="right">${freePractice3}</td></tr>
                    <tr><td>${card.translation('circuitname')}</td><td>${race.Circuit.circuitName}</td><td>&nbsp;</td><td>${card.translation('qualifying')}</td><td align="right">${qualifyingDate}</td></tr>
                    <tr><td>${card.translation('location')}</td><td>${race.Circuit.Location.country}</td><td>&nbsp;</td><td>${card.translation('sprint')}</td><td align="right">${sprintDate}</td></tr>        
                    <tr><td>${card.translation('city')}</td><td>${race.Circuit.Location.locality}</td><td>&nbsp;</td><td>${card.translation('racetime')}</td><td align="right">${raceDateFormatted}</td></tr>`;
    }))}`;
};
exports.renderRaceInfo = renderRaceInfo;
const renderLastYearsResults = (config, raceData) => {
    var _a, _b;
    if (!raceData) {
        return (0, lit_1.html) ``;
    }
    const result = raceData.Results ? raceData.Results[0] : null;
    const fastest = (_a = raceData.Results) === null || _a === void 0 ? void 0 : _a.filter((result) => { var _a; return ((_a = result.FastestLap) === null || _a === void 0 ? void 0 : _a.rank) === '1'; })[0];
    return (0, lit_1.html) `<tr>
        <td colspan="5">
            <table class="weather-info">
                <tr>
                    <td class="text-center">
                        <h1 class="${(config.f1_font ? 'formulaone-font' : '')}">${new Date(raceData.date).getFullYear()}</h1>
                        <h2 class="${(config.f1_font ? 'formulaone-font' : '')}">
                            <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> ${result === null || result === void 0 ? void 0 : result.Driver.givenName} ${result === null || result === void 0 ? void 0 : result.Driver.familyName} (${result === null || result === void 0 ? void 0 : result.Constructor.name})
                        </h2>
                        <h3 class="${(config.f1_font ? 'formulaone-font' : '')}">
                            <ha-icon slot="icon" icon="mdi:timer-outline"></ha-icon> ${fastest === null || fastest === void 0 ? void 0 : fastest.Driver.givenName} ${fastest === null || fastest === void 0 ? void 0 : fastest.Driver.familyName} (${(_b = fastest === null || fastest === void 0 ? void 0 : fastest.FastestLap) === null || _b === void 0 ? void 0 : _b.Time.time})
                        </h3>
                    </td>
                </tr>
            </table>
        </td>
        <tr><td colspan="5">&nbsp;</td></tr>`;
};
exports.renderLastYearsResults = renderLastYearsResults;
const renderWeatherInfo = (weatherData, config, raceDate) => {
    var _a, _b;
    if (!weatherData) {
        return (0, lit_1.html) ``;
    }
    const windUnit = ((_a = config.weather_options) === null || _a === void 0 ? void 0 : _a.unit) === formulaone_card_types_1.WeatherUnit.Metric ? 'km/h' : 'mph';
    const tempUnit = ((_b = config.weather_options) === null || _b === void 0 ? void 0 : _b.unit) === formulaone_card_types_1.WeatherUnit.MilesFahrenheit ? '°F' : '°C';
    const hourData = weatherData.hours ? weatherData.hours[raceDate.getHours()] : weatherData;
    return (0, lit_1.html) `<tr>
                    <td colspan="5">
                        <table class="weather-info">
                            <tr>
                                <td><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> ${(0, exports.calculateWindDirection)(hourData.winddir)} ${hourData.windspeed} ${windUnit}</td>
                                <td><ha-icon slot="icon" icon="mdi:weather-pouring"></ha-icon> ${hourData.precip} mm</td>
                                <td><ha-icon slot="icon" icon="mdi:cloud-percent-outline"></ha-icon> ${hourData.precipprob}%</td>
                            </tr>
                            <tr>
                                <td><ha-icon slot="icon" icon="mdi:clouds"></ha-icon> ${hourData.cloudcover} %</td>
                                <td><ha-icon slot="icon" icon="mdi:thermometer-lines"></ha-icon> ${hourData.temp} ${tempUnit}</td>
                                <td><ha-icon slot="icon" icon="mdi:sun-thermometer"></ha-icon> ${hourData.feelslike} ${tempUnit}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr><td colspan="5">&nbsp;</td></tr>`;
};
exports.renderWeatherInfo = renderWeatherInfo;
const calculateWindDirection = (windDirection) => {
    const directions = [
        { label: 'N', range: [0, 11.25] },
        { label: 'NNE', range: [11.25, 33.75] },
        { label: 'NE', range: [33.75, 56.25] },
        { label: 'ENE', range: [56.25, 78.75] },
        { label: 'E', range: [78.75, 101.25] },
        { label: 'ESE', range: [101.25, 123.75] },
        { label: 'SE', range: [123.75, 146.25] },
        { label: 'SSE', range: [146.25, 168.75] },
        { label: 'S', range: [168.75, 191.25] },
        { label: 'SSW', range: [191.25, 213.75] },
        { label: 'SW', range: [213.75, 236.25] },
        { label: 'WSW', range: [236.25, 258.75] },
        { label: 'W', range: [258.75, 281.25] },
        { label: 'WNW', range: [281.25, 303.75] },
        { label: 'NW', range: [303.75, 326.25] },
        { label: 'NNW', range: [326.25, 348.75] },
        { label: 'N', range: [348.75, 360] }
    ];
    for (const { label, range } of directions) {
        if (windDirection >= range[0] && windDirection <= range[1]) {
            return label;
        }
    }
};
exports.calculateWindDirection = calculateWindDirection;
const getRefreshTime = (endpoint) => {
    let refreshCacheHours = 24;
    const now = new Date();
    const scheduleLocalStorage = localStorage.getItem(`${now.getFullYear()}.json`);
    if (scheduleLocalStorage) {
        const item = JSON.parse(scheduleLocalStorage);
        const schedule = JSON.parse(item.data);
        const filteredRaces = schedule.MRData.RaceTable.Races.filter(race => new Date(race.date).toLocaleDateString == now.toLocaleDateString);
        if (filteredRaces.length > 0) {
            const todaysRace = filteredRaces[0];
            const raceTime = new Date(todaysRace.date + 'T' + todaysRace.time);
            const lastResultLocalStorage = localStorage.getItem(endpoint);
            if (lastResultLocalStorage) {
                const resultItem = JSON.parse(lastResultLocalStorage);
                if (new Date(resultItem.created) < raceTime) {
                    refreshCacheHours = 1;
                }
            }
        }
    }
    return refreshCacheHours;
};
exports.getRefreshTime = getRefreshTime;
const reduceArray = (array, number) => {
    if (array === undefined) {
        return [];
    }
    return number ? array.slice(0, number) : array;
};
exports.reduceArray = reduceArray;
const renderConstructorColumn = (card, constructor) => {
    return (0, lit_1.html) `<td>${(card.config.standings.show_teamlogo ? (0, lit_1.html) `<img class="constructor-logo" height="20" width="20" src="${(0, exports.getTeamImage)(card, constructor.constructorId)}">&nbsp;` : '')}${constructor.name}</td>`;
};
exports.renderConstructorColumn = renderConstructorColumn;


/***/ }),

/***/ 5674:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Nz: () => (/* binding */ t),
/* harmony export */   Oi: () => (/* binding */ e),
/* harmony export */   eZ: () => (/* binding */ o)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=(e,t,o)=>{Object.defineProperty(t,o,e)},t=(e,t)=>({kind:"method",placement:"prototype",key:t.key,descriptor:e}),o=({finisher:e,descriptor:t})=>(o,n)=>{var r;if(void 0===n){const n=null!==(r=o.originalKey)&&void 0!==r?r:o.key,i=null!=t?{kind:"method",placement:"prototype",key:n,descriptor:t(o.key)}:{...o,key:n};return null!=e&&(i.finisher=function(t){e(t,n)}),i}{const r=o.constructor;void 0!==t&&Object.defineProperty(o,n,t(n)),null==e||e(r,n)}};
//# sourceMappingURL=base.js.map


/***/ }),

/***/ 5713:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return{kind:t,elements:s,finisher(n){customElements.define(e,n)}}})(e,n);
//# sourceMappingURL=custom-element.js.map


/***/ }),

/***/ 8829:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5674);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e(e){return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__/* .decorateProperty */ .eZ)({finisher:(r,t)=>{Object.assign(r.prototype[t],e)}})}
//# sourceMappingURL=event-options.js.map


/***/ }),

/***/ 760:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(n){n.createProperty(e.key,i)}};function e(e){return(n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i)})(e,n,t):i(e,n)}
//# sourceMappingURL=property.js.map


/***/ }),

/***/ 3711:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5674);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e(e){return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__/* .decorateProperty */ .eZ)({descriptor:r=>({get(){var r,o;return null!==(o=null===(r=this.renderRoot)||void 0===r?void 0:r.querySelectorAll(e))&&void 0!==o?o:[]},enumerable:!0,configurable:!0})})}
//# sourceMappingURL=query-all.js.map


/***/ }),

/***/ 7935:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5674);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;const e=null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));function l(n){const{slot:l,selector:t}=null!=n?n:{};return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__/* .decorateProperty */ .eZ)({descriptor:o=>({get(){var o;const r="slot"+(l?`[name=${l}]`:":not([name])"),i=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(r),s=null!=i?e(i,n):[];return t?s.filter((o=>o.matches(t))):s},enumerable:!0,configurable:!0})})}
//# sourceMappingURL=query-assigned-elements.js.map


/***/ }),

/***/ 43:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5674);
/* harmony import */ var _query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7935);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function o(o,n,r){let l,s=o;return"object"==typeof o?(s=o.slot,l=o):l={flatten:n},r?(0,_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_0__/* .queryAssignedElements */ .N)({slot:s,flatten:n,selector:r}):(0,_base_js__WEBPACK_IMPORTED_MODULE_1__/* .decorateProperty */ .eZ)({descriptor:e=>({get(){var e,t;const o="slot"+(s?`[name=${s}]`:":not([name])"),n=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(o);return null!==(t=null==n?void 0:n.assignedNodes(l))&&void 0!==t?t:[]},enumerable:!0,configurable:!0})})}
//# sourceMappingURL=query-assigned-nodes.js.map


/***/ }),

/***/ 8602:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5674);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e(e){return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__/* .decorateProperty */ .eZ)({descriptor:r=>({async get(){var r;return await this.updateComplete,null===(r=this.renderRoot)||void 0===r?void 0:r.querySelector(e)},enumerable:!0,configurable:!0})})}
//# sourceMappingURL=query-async.js.map


/***/ }),

/***/ 2669:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ i)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5674);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function i(i,n){return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__/* .decorateProperty */ .eZ)({descriptor:o=>{const t={get(){var o,n;return null!==(n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==n?n:null},enumerable:!0,configurable:!0};if(n){const n="symbol"==typeof o?Symbol():"__"+o;t.get=function(){var o,t;return void 0===this[n]&&(this[n]=null!==(t=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==t?t:null),this[n]}}return t}})}
//# sourceMappingURL=query.js.map


/***/ }),

/***/ 9158:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ t)
/* harmony export */ });
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(760);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t(t){return (0,_property_js__WEBPACK_IMPORTED_MODULE_0__/* .property */ .C)({...t,state:!0})}
//# sourceMappingURL=state.js.map


/***/ }),

/***/ 7898:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  c3: () => (/* reexport */ o),
  fl: () => (/* binding */ d),
  ec: () => (/* reexport */ S),
  iv: () => (/* reexport */ i),
  Ts: () => (/* binding */ reactive_element_n),
  i1: () => (/* reexport */ c),
  Qu: () => (/* binding */ a),
  FV: () => (/* reexport */ e),
  $m: () => (/* reexport */ r)
});

;// CONCATENATED MODULE: ./node_modules/@lit/reactive-element/css-tag.js
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n.set(s,t))}return t}toString(){return this.cssText}}const r=t=>new o("string"==typeof t?t:t+"",void 0,s),i=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o(n,t,s)},S=(s,n)=>{e?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n)}))},c=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r(e)})(t):t;
//# sourceMappingURL=css-tag.js.map

;// CONCATENATED MODULE: ./node_modules/@lit/reactive-element/reactive-element.js

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var reactive_element_s;const reactive_element_e=window,reactive_element_r=reactive_element_e.trustedTypes,h=reactive_element_r?reactive_element_r.emptyScript:"",reactive_element_o=reactive_element_e.reactiveElementPolyfillSupport,reactive_element_n={toAttribute(t,i){switch(i){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},a=(t,i)=>i!==t&&(i==i||t==t),l={attribute:!0,type:String,converter:reactive_element_n,reflect:!1,hasChanged:a};class d extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e))})),t}static createProperty(t,i=l){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c(i))}else void 0!==i&&s.push(c(i));return s}static _$Ep(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$EO(t,i,s=l){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:reactive_element_n).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:reactive_element_n;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}d.finalized=!0,d.elementProperties=new Map,d.elementStyles=[],d.shadowRootOptions={mode:"open"},null==reactive_element_o||reactive_element_o({ReactiveElement:d}),(null!==(reactive_element_s=reactive_element_e.reactiveElementVersions)&&void 0!==reactive_element_s?reactive_element_s:reactive_element_e.reactiveElementVersions=[]).push("1.6.1");
//# sourceMappingURL=reactive-element.js.map


/***/ }),

/***/ 936:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.c3),
/* harmony export */   LitElement: () => (/* reexport safe */ _lit_element_js__WEBPACK_IMPORTED_MODULE_2__.oi),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.fl),
/* harmony export */   UpdatingElement: () => (/* reexport safe */ _lit_element_js__WEBPACK_IMPORTED_MODULE_2__.f4),
/* harmony export */   _$LE: () => (/* reexport safe */ _lit_element_js__WEBPACK_IMPORTED_MODULE_2__.uD),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ec),
/* harmony export */   css: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.iv),
/* harmony export */   customElement: () => (/* reexport safe */ _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_4__.M),
/* harmony export */   decorateProperty: () => (/* reexport safe */ _lit_reactive_element_decorators_base_js__WEBPACK_IMPORTED_MODULE_3__.eZ),
/* harmony export */   defaultConverter: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.Ts),
/* harmony export */   eventOptions: () => (/* reexport safe */ _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_7__.h),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.i1),
/* harmony export */   html: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   legacyPrototypeMethod: () => (/* reexport safe */ _lit_reactive_element_decorators_base_js__WEBPACK_IMPORTED_MODULE_3__.Oi),
/* harmony export */   noChange: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.Qu),
/* harmony export */   nothing: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   property: () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_5__.C),
/* harmony export */   query: () => (/* reexport safe */ _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_8__.I),
/* harmony export */   queryAll: () => (/* reexport safe */ _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_9__.K),
/* harmony export */   queryAssignedElements: () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_11__.N),
/* harmony export */   queryAssignedNodes: () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_12__.v),
/* harmony export */   queryAsync: () => (/* reexport safe */ _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_10__.G),
/* harmony export */   render: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   standardPrototypeMethod: () => (/* reexport safe */ _lit_reactive_element_decorators_base_js__WEBPACK_IMPORTED_MODULE_3__.Nz),
/* harmony export */   state: () => (/* reexport safe */ _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_6__.S),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.FV),
/* harmony export */   svg: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.$m)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7898);
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3692);
/* harmony import */ var _lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8922);
/* harmony import */ var _lit_reactive_element_decorators_base_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5674);
/* harmony import */ var _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5713);
/* harmony import */ var _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(760);
/* harmony import */ var _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9158);
/* harmony import */ var _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8829);
/* harmony import */ var _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2669);
/* harmony import */ var _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3711);
/* harmony import */ var _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8602);
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(7935);
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(43);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'. See https://lit.dev/msg/deprecated-import-path for more information.");
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 8922:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $m: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.$m),
/* harmony export */   Al: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   FV: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.FV),
/* harmony export */   Jb: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   Ld: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   Qu: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.Qu),
/* harmony export */   Ts: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.Ts),
/* harmony export */   YP: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   c3: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.c3),
/* harmony export */   dy: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   ec: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ec),
/* harmony export */   f4: () => (/* binding */ r),
/* harmony export */   fl: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.fl),
/* harmony export */   i1: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.i1),
/* harmony export */   iv: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.iv),
/* harmony export */   oi: () => (/* binding */ s),
/* harmony export */   sY: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   uD: () => (/* binding */ h)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7898);
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3692);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;const r=_lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__/* .ReactiveElement */ .fl;class s extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__/* .ReactiveElement */ .fl{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});const h={_$AK:(t,e,i)=>{t._$AK(e,i)},_$AL:t=>t._$AL};(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.3");
//# sourceMappingURL=lit-element.js.map


/***/ }),

/***/ 5206:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sR: () => (/* binding */ c)
/* harmony export */ });
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4232);
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(875);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=(i,t)=>{var e,o;const r=i._$AN;if(void 0===r)return!1;for(const i of r)null===(o=(e=i)._$AO)||void 0===o||o.call(e,t,!1),s(i,t);return!0},o=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t}while(0===(null==e?void 0:e.size))},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),l(t)}};function n(i){void 0!==this._$AN?(o(this),this._$AM=i,r(this)):this._$AM=i}function h(i,t=!1,e=0){const r=this._$AH,n=this._$AN;if(void 0!==n&&0!==n.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],!1),o(r[i]);else null!=r&&(s(r,!1),o(r));else s(this,i)}const l=i=>{var t,s,o,r;i.type==_directive_js__WEBPACK_IMPORTED_MODULE_1__/* .PartType */ .pX.CHILD&&(null!==(t=(o=i)._$AP)&&void 0!==t||(o._$AP=h),null!==(s=(r=i)._$AQ)&&void 0!==s||(r._$AQ=n))};class c extends _directive_js__WEBPACK_IMPORTED_MODULE_1__/* .Directive */ .Xe{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU}_$AO(i,t=!0){var e,r;i!==this.isConnected&&(this.isConnected=i,i?null===(e=this.reconnected)||void 0===e||e.call(this):null===(r=this.disconnected)||void 0===r||r.call(this)),t&&(s(this,i),o(this))}setValue(t){if((0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .isSingleExpression */ .OR)(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}
//# sourceMappingURL=async-directive.js.map


/***/ }),

/***/ 4232:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OR: () => (/* binding */ e),
/* harmony export */   pt: () => (/* binding */ i)
/* harmony export */ });
/* unused harmony exports TemplateResultType, clearPart, getCommittedValue, getDirectiveClass, insertPart, isCompiledTemplateResult, isDirectiveResult, isTemplateResult, removePart, setChildPartValue, setCommittedValue */
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3692);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:l}=_lit_html_js__WEBPACK_IMPORTED_MODULE_0__._$LH,i=o=>null===o||"object"!=typeof o&&"function"!=typeof o,n={HTML:1,SVG:2},t=(o,l)=>void 0===l?void 0!==(null==o?void 0:o._$litType$):(null==o?void 0:o._$litType$)===l,v=o=>{var l;return null!=(null===(l=null==o?void 0:o._$litType$)||void 0===l?void 0:l.h)},d=o=>void 0!==(null==o?void 0:o._$litDirective$),u=o=>null==o?void 0:o._$litDirective$,e=o=>void 0===o.strings,r=()=>document.createComment(""),c=(o,i,n)=>{var t;const v=o._$AA.parentNode,d=void 0===i?o._$AB:i._$AA;if(void 0===n){const i=v.insertBefore(r(),d),t=v.insertBefore(r(),d);n=new l(i,t,o,o.options)}else{const l=n._$AB.nextSibling,i=n._$AM,u=i!==o;if(u){let l;null===(t=n._$AQ)||void 0===t||t.call(n,o),n._$AM=o,void 0!==n._$AP&&(l=o._$AU)!==i._$AU&&n._$AP(l)}if(l!==d||u){let o=n._$AA;for(;o!==l;){const l=o.nextSibling;v.insertBefore(o,d),o=l}}}return n},f=(o,l,i=o)=>(o._$AI(l,i),o),s={},a=(o,l=s)=>o._$AH=l,m=o=>o._$AH,p=o=>{var l;null===(l=o._$AP)||void 0===l||l.call(o,!1,!0);let i=o._$AA;const n=o._$AB.nextSibling;for(;i!==n;){const o=i.nextSibling;i.remove(),i=o}},h=o=>{o._$AR()};
//# sourceMappingURL=directive-helpers.js.map


/***/ }),

/***/ 875:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XM: () => (/* binding */ e),
/* harmony export */   Xe: () => (/* binding */ i),
/* harmony export */   pX: () => (/* binding */ t)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ }),

/***/ 2069:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dS: () => (/* binding */ i),
/* harmony export */   gw: () => (/* binding */ t),
/* harmony export */   nX: () => (/* binding */ s)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=async(t,s)=>{for await(const i of t)if(!1===await s(i))return};class s{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}}class i{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){var t;null!==(t=this.Y)&&void 0!==t||(this.Y=new Promise((t=>this.Z=t)))}resume(){var t;null===(t=this.Z)||void 0===t||t.call(this),this.Y=this.Z=void 0}}
//# sourceMappingURL=private-async-helpers.js.map


/***/ }),

/***/ 7345:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UntilDirective: () => (/* binding */ c),
/* harmony export */   until: () => (/* binding */ m)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3692);
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4232);
/* harmony import */ var _async_directive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5206);
/* harmony import */ var _private_async_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2069);
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(875);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n=t=>!(0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .isPrimitive */ .pt)(t)&&"function"==typeof t.then,h=1073741823;class c extends _async_directive_js__WEBPACK_IMPORTED_MODULE_2__/* .AsyncDirective */ .sR{constructor(){super(...arguments),this._$C_t=h,this._$Cwt=[],this._$Cq=new _private_async_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .PseudoWeakRef */ .nX(this),this._$CK=new _private_async_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .Pauser */ .dS}render(...s){var i;return null!==(i=s.find((t=>!n(t))))&&void 0!==i?i:_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}update(s,i){const r=this._$Cwt;let e=r.length;this._$Cwt=i;const o=this._$Cq,c=this._$CK;this.isConnected||this.disconnected();for(let t=0;t<i.length&&!(t>this._$C_t);t++){const s=i[t];if(!n(s))return this._$C_t=t,s;t<e&&s===r[t]||(this._$C_t=h,e=0,Promise.resolve(s).then((async t=>{for(;c.get();)await c.get();const i=o.deref();if(void 0!==i){const r=i._$Cwt.indexOf(s);r>-1&&r<i._$C_t&&(i._$C_t=r,i.setValue(t))}})))}return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}disconnected(){this._$Cq.disconnect(),this._$CK.pause()}reconnected(){this._$Cq.reconnect(this),this._$CK.resume()}}const m=(0,_directive_js__WEBPACK_IMPORTED_MODULE_3__/* .directive */ .XM)(c);
//# sourceMappingURL=until.js.map


/***/ }),

/***/ 3692:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ x),
/* harmony export */   noChange: () => (/* binding */ T),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ b)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=window,s=i.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,o="$lit$",n=`lit$${(Math.random()+"").slice(9)}$`,l="?"+n,h=`<${l}>`,r=document,u=()=>r.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),b=w(2),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,e=[];let l,r=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let d,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(l=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=l?l:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,d=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,l=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";r+=u===f?s+h:v>=0?(e.push(d),s.slice(0,v)+o+s.slice(v)+n+w):s+n+(-2===v?(e.push(void 0),i):w)}return[P(t,r+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class N{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,d=0;const c=t.length-1,v=this.parts,[a,f]=V(t,i);if(this.el=N.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o)||i.startsWith(n)){const s=f[d++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o).split(n),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k})}else v.push({type:6,index:r})}for(const i of t)h.removeAttribute(i)}if(y.test(h.tagName)){const t=h.textContent.split(n),i=t.length-1;if(i>0){h.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],u()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],u())}}}else if(8===h.nodeType)if(h.data===l)v.push({type:2,index:r});else{let t=-1;for(;-1!==(t=h.data.indexOf(n,t+1));)v.push({type:7,index:r}),t+=n.length-1}r++}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return(null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=S(t,r._$AS(t,i.values),r,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,u=e[0];for(;void 0!==u;){if(l===u.index){let i;2===u.type?i=new R(n,n.nextSibling,this,t):1===u.type?i=new u.ctor(n,u.name,u.strings,this,t):6===u.type&&(i=new Z(n,this,t)),this._$AV.push(i),u=e[++h]}l!==(null==u?void 0:u.index)&&(n=C.nextNode(),l++)}return C.currentNode=r,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class R{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=N.createElement(P(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else{const t=new M(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new R(this.k(u()),this.k(u()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class k{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else{const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=S(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h}n&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class H extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}const I=s?s.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name)}}class z extends k{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}}const j={O:o,P:n,A:l,C:1,M:V,L:M,R:v,D:S,I:R,V:k,H:L,N:z,U:H,F:Z},B=i.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.8.0");const D=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new R(i.insertBefore(u(),t),t,void 0,null!=s?s:{})}return l._$AI(t),l};
//# sourceMappingURL=lit-html.js.map


/***/ }),

/***/ 9662:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customElement: () => (/* reexport safe */ _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__.M),
/* harmony export */   eventOptions: () => (/* reexport safe */ _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__.h),
/* harmony export */   property: () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__.C),
/* harmony export */   query: () => (/* reexport safe */ _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__.I),
/* harmony export */   queryAll: () => (/* reexport safe */ _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__.K),
/* harmony export */   queryAssignedElements: () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_7__.N),
/* harmony export */   queryAssignedNodes: () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_8__.v),
/* harmony export */   queryAsync: () => (/* reexport safe */ _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__.G),
/* harmony export */   state: () => (/* reexport safe */ _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__.S)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5713);
/* harmony import */ var _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(760);
/* harmony import */ var _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9158);
/* harmony import */ var _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8829);
/* harmony import */ var _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2669);
/* harmony import */ var _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3711);
/* harmony import */ var _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8602);
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7935);
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(43);

//# sourceMappingURL=decorators.js.map


/***/ }),

/***/ 8082:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* reexport safe */ lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__.Xe),
/* harmony export */   PartType: () => (/* reexport safe */ lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__.pX),
/* harmony export */   directive: () => (/* reexport safe */ lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__.XM)
/* harmony export */ });
/* harmony import */ var lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(875);

//# sourceMappingURL=directive.js.map


/***/ }),

/***/ 530:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AsyncReplaceDirective: () => (/* reexport */ o),
  asyncReplace: () => (/* reexport */ h)
});

// EXTERNAL MODULE: ./node_modules/lit-html/lit-html.js
var lit_html = __webpack_require__(3692);
// EXTERNAL MODULE: ./node_modules/lit-html/async-directive.js
var async_directive = __webpack_require__(5206);
// EXTERNAL MODULE: ./node_modules/lit-html/directives/private-async-helpers.js
var private_async_helpers = __webpack_require__(2069);
// EXTERNAL MODULE: ./node_modules/lit-html/directive.js
var directive = __webpack_require__(875);
;// CONCATENATED MODULE: ./node_modules/lit-html/directives/async-replace.js

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class o extends async_directive/* AsyncDirective */.sR{constructor(){super(...arguments),this._$Cq=new private_async_helpers/* PseudoWeakRef */.nX(this),this._$CK=new private_async_helpers/* Pauser */.dS}render(i,s){return lit_html.noChange}update(i,[s,r]){if(this.isConnected||this.disconnected(),s===this._$CX)return;this._$CX=s;let n=0;const{_$Cq:o,_$CK:h}=this;return (0,private_async_helpers/* forAwaitOf */.gw)(s,(async t=>{for(;h.get();)await h.get();const i=o.deref();if(void 0!==i){if(i._$CX!==s)return!1;void 0!==r&&(t=r(t,n)),i.commitValue(t,n),n++}return!0})),lit_html.noChange}commitValue(t,i){this.setValue(t)}disconnected(){this._$Cq.disconnect(),this._$CK.pause()}reconnected(){this._$Cq.reconnect(this),this._$CK.resume()}}const h=(0,directive/* directive */.XM)(o);
//# sourceMappingURL=async-replace.js.map

;// CONCATENATED MODULE: ./node_modules/lit/directives/async-replace.js

//# sourceMappingURL=async-replace.js.map


/***/ }),

/***/ 6370:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CSSResult: () => (/* reexport */ lit_element/* CSSResult */.c3),
  LitElement: () => (/* reexport */ lit_element/* LitElement */.oi),
  ReactiveElement: () => (/* reexport */ lit_element/* ReactiveElement */.fl),
  UpdatingElement: () => (/* reexport */ lit_element/* UpdatingElement */.f4),
  _$LE: () => (/* reexport */ lit_element/* _$LE */.uD),
  _$LH: () => (/* reexport */ lit_element/* _$LH */.Al),
  adoptStyles: () => (/* reexport */ lit_element/* adoptStyles */.ec),
  css: () => (/* reexport */ lit_element/* css */.iv),
  defaultConverter: () => (/* reexport */ lit_element/* defaultConverter */.Ts),
  getCompatibleStyle: () => (/* reexport */ lit_element/* getCompatibleStyle */.i1),
  html: () => (/* reexport */ lit_element/* html */.dy),
  isServer: () => (/* reexport */ o),
  noChange: () => (/* reexport */ lit_element/* noChange */.Jb),
  notEqual: () => (/* reexport */ lit_element/* notEqual */.Qu),
  nothing: () => (/* reexport */ lit_element/* nothing */.Ld),
  render: () => (/* reexport */ lit_element/* render */.sY),
  supportsAdoptingStyleSheets: () => (/* reexport */ lit_element/* supportsAdoptingStyleSheets */.FV),
  svg: () => (/* reexport */ lit_element/* svg */.YP),
  unsafeCSS: () => (/* reexport */ lit_element/* unsafeCSS */.$m)
});

// EXTERNAL MODULE: ./node_modules/@lit/reactive-element/reactive-element.js + 1 modules
var reactive_element = __webpack_require__(7898);
// EXTERNAL MODULE: ./node_modules/lit-html/lit-html.js
var lit_html = __webpack_require__(3692);
// EXTERNAL MODULE: ./node_modules/lit-element/lit-element.js
var lit_element = __webpack_require__(8922);
;// CONCATENATED MODULE: ./node_modules/lit-html/is-server.js
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o=!1;
//# sourceMappingURL=is-server.js.map

;// CONCATENATED MODULE: ./node_modules/lit/index.js

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4147:
/***/ ((module) => {

module.exports = JSON.parse('{"name":"formulaone-card","version":"1.8.6","description":"Frontend card for Home Assistant to display Formula One data","main":"index.js","scripts":{"lint":"eslint src/**/*.ts","dev":"webpack -c webpack.config.js","build":"yarn lint && webpack -c webpack.config.js","test":"jest","coverage":"jest --coverage","workflow":"jest --coverage --json --outputFile=/home/runner/work/formulaone-card/formulaone-card/jest.results.json","prebuild":"copy git-hooks\\\\pre-commit .git\\\\hooks\\\\ && echo \'hook copied\'"},"repository":{"type":"git","url":"git+https://github.com/marcokreeft87/formulaone-card.git"},"keywords":[],"author":"","license":"ISC","bugs":{"url":"https://github.com/marcokreeft87/formulaone-card/issues"},"homepage":"https://github.com/marcokreeft87/formulaone-card#readme","devDependencies":{"@types/jest":"^29.5.3","@typescript-eslint/eslint-plugin":"^5.59.8","@typescript-eslint/parser":"^5.62.0","codecov":"^3.8.3","eslint":"^8.50.0","home-assistant-js-websocket":"^8.2.0","lit":"^2.8.0","typescript":"^4.9.5","webpack":"^5.88.2","webpack-cli":"^5.1.4"},"dependencies":{"@babel/plugin-transform-runtime":"^7.22.5","@babel/preset-env":"^7.22.14","@lit-labs/scoped-registry-mixin":"^1.0.1","@marcokreeft/ha-editor-formbuilder":"^2023.10.1","babel-jest":"^29.7.0","compression-webpack-plugin":"^10.0.0","custom-card-helpers":"^1.9.0","isomorphic-fetch":"^3.0.0","jest-environment-jsdom":"^29.6.2","jest-fetch-mock":"^3.0.3","jest-ts-auto-mock":"^2.1.0","ts-auto-mock":"^3.6.4","ts-jest":"^29.1.1","ts-loader":"^9.4.4","ttypescript":"^1.5.15","yarn":"^1.22.19"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(3607);
/******/ 	
/******/ })()
;