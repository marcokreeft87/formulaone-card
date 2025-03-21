import { html, HTMLTemplateResult, LitElement, PropertyValues } from "lit";
import { FormulaOneCardConfig, FormulaOneCardType, LocalStorageItem, Translation, WeatherUnit } from "./types/formulaone-card-types";
import { Constructor, Driver, Race, Root, Location } from "./api/f1-models";
import FormulaOneCard from ".";
import { BaseCard } from "./cards/base-card";
import { formatDateTimeRaceInfo } from "./lib/format_date_time";
import { ActionHandlerEvent, handleAction, hasAction, HomeAssistant } from "custom-card-helpers";
import { formatDateNumeric } from "./lib/format_date";
import { ImageConstants } from "./lib/constants";
import { actionHandler } from './directives/action-handler-directive';
import RestCountryClient from "./api/restcountry-client";
import { until } from 'lit-html/directives/until.js';
import { Day, Hour } from "./api/weather-models";

export const hasConfigOrCardValuesChanged = (node: FormulaOneCard, changedProps: PropertyValues) => {
    if (changedProps.has('config')) {
        return true;
    }

    const card = changedProps.get('card') as BaseCard;
    if (card && card.parent) {
        return card.parent.properties !== node.properties;
    }

    const cardValues = changedProps.get('cardValues') as Map<string, unknown>;
    if(cardValues) {
        return cardValues != node.properties;
    }

    return false;
};

export const getCountries = () => {
    const countryClient = new RestCountryClient();
    return countryClient.GetCountriesFromLocalStorage();
}

export const getCountryFlagByNationality = (card: BaseCard, nationality: string) => {
    const countries = getCountries();

    nationality = nationality.trim();
    const exceptions = [{ demonym: 'Argentinian', corrected: 'Argentinean'}];
    const exception = exceptions.filter(exception => exception.demonym == nationality);
    if(exception.length > 0)
    {
        nationality = exception[0].corrected;
    }
    
    const country = countries.filter(x => x.demonym == nationality);
    if(country.length > 1)
    {
        return card.imageClient.GetImage(country.sort((a, b) => (a.population > b.population) ? -1 : 1)[0].flags.png);
    }

    return card.imageClient.GetImage(country[0].flags.png);
}

export const getCountryFlagByName = (card: BaseCard, countryName: string) => {
    const countries = getCountries();
    
    const country = countries.filter(x => x.name == countryName || x.nativeName == countryName ||
        x.altSpellings?.includes(countryName))[0];

    return card.imageClient.GetImage(country.flags.png);
}

export const checkConfig = (config: FormulaOneCardConfig) => {
    if (config.card_type === undefined) {
        throw new Error('Please define FormulaOne card type (card_type).');
    }
};

export const getTeamImage = (card: BaseCard, teamName: string) => {
    teamName = teamName.toLocaleLowerCase().replace('_', '-');
    const exceptions = [{ teamName: 'red-bull', corrected: 'red-bull-racing'}, { teamName: 'alfa', corrected: 'alfa-romeo'}, { teamName: 'haas', corrected: 'haas-f1-team'}, { teamName: 'sauber', corrected: 'kick-sauber'}];

    const exception = exceptions.filter(exception => exception.teamName == teamName);
    if(exception.length > 0)
    {
        teamName = exception[0].corrected;
    }

    return card.imageClient.GetImage(`${ImageConstants.TeamLogoCDN}/2024/${teamName.toLowerCase()}-logo.png.transform/2col-retina/image.png`);
}

export const getCircuitName = (location: Location) => {
    
    let circuitName = location.country.replace(" ","-")
    const exceptions = [{ countryDashed: 'UAE', name: 'Abu_Dhabi'}, { countryDashed: 'UK', name: 'Great_Britain'}, 
    { countryDashed: 'Monaco', name: 'Monoco'}, { countryDashed: 'Azerbaijan', name: 'Baku'}, { countryDashed: 'Saudi-Arabia', name: 'Saudi_Arabia'}];

    const exception = exceptions.filter(exception => exception.countryDashed == circuitName);
    if(exception.length > 0)
    {
        circuitName = exception[0].name; 
    }

    if((location.country == 'USA' || location.country == 'United States') && location.locality != 'Austin')
    {
        circuitName = location.locality.replace(" ","_");
    }

    if(location.country == 'Italy' && location.locality == 'Imola')
    {
        circuitName = "Emilia_Romagna";
    }

    return circuitName;
}

export const getDriverName = (driver: Driver, config: FormulaOneCardConfig) => {
    const permanentNumber = driver.code == 'VER' ? 1 : driver.permanentNumber;
    return `${driver.givenName} ${driver.familyName}${(config.show_carnumber ? ` #${permanentNumber}` : '')}`;
}

export const getApiErrorMessage = (dataType: string) => {
    return html`<table><tr><td class="text-center"><ha-icon icon="mdi:alert-circle"></ha-icon> Error getting ${dataType} <ha-icon icon="mdi:alert-circle"></ha-icon></td></tr></table>`
}

export const getApiLoadingMessage = () => {
    return html`<table><tr><td class="text-center"><ha-icon icon="mdi:car-speed-limiter"></ha-icon> Loading... <ha-icon icon="mdi:car-speed-limiter"></ha-icon></td></tr></table>`
}

export const getEndOfSeasonMessage = (message: string) => {
    return html`<table><tr><td class="text-center"><ha-icon icon="mdi:flag-checkered"></ha-icon><strong>${message}</strong><ha-icon icon="mdi:flag-checkered"></ha-icon></td></tr></table>`;
} 

export const clickHandler = (node: LitElement, config: FormulaOneCardConfig, hass: HomeAssistant, ev: ActionHandlerEvent) => {
    handleAction(node, hass, config.actions, ev.detail.action);
}

export const renderHeader = (card: BaseCard, race: Race, preventClick = false): HTMLTemplateResult => {
    
    const circuitName = getCircuitName(race.Circuit.Location);

    const _handleAction = (ev: ActionHandlerEvent): void => {
        if (card.hass && card.config.actions && ev.detail.action && !preventClick) {
            clickHandler(card.parent, card.config, card.hass, ev);
        }
    }
    
    const hasConfigAction = card.config.image_clickable || card.config.actions !== undefined;
    const circuitUrl = race.Circuit.url;

    if(card.config.image_clickable && !card.config.actions) {
        card.config.actions = {
            tap_action: {
                action: 'url',
                url_path: circuitUrl
            }
        };
    }

    const imageHtml = html`<img width="100%" src="${card.imageClient.GetImage(`${ImageConstants.F1CDN}Circuit%20maps%2016x9/${circuitName}_Circuit.png.transform/7col/image.png`)}" @action=${_handleAction}
    .actionHandler=${actionHandler({
        hasHold: hasAction(card.config.actions?.hold_action),
        hasDoubleClick: hasAction(card.config.actions?.double_tap_action),
      })} class="${(hasConfigAction ? ' clickable' : null)}" />`;
    const raceName = html`<h2 class="${(card.config.f1_font ? 'formulaone-font' : '')}"><img height="25" src="${getCountryFlagByName(card, race.Circuit.Location.country)}">&nbsp;  ${race.round} :  ${race.raceName}</h2>`;
    
    return html`${(card.config.card_type == FormulaOneCardType.Countdown ? html`` : raceName)} ${(card.config.hide_tracklayout ? html`` : imageHtml)}<br>`;
}

export const renderRaceInfo = (card: BaseCard, race: Race, raceDateTime?: Date) => {
    const config = card.config;
    const hass = card.hass;

    if(config.hide_racedatetimes) {
        return html``;
    }    

    const configWeatherApi = config.show_weather && config.weather_options?.api_key !== undefined;
    const weatherPromise = configWeatherApi ? card.weatherClient.getWeatherData(race.Circuit.Location.lat, race.Circuit.Location.long, `${race.date}T${race.time}`) : Promise.resolve(null);
    const lastYearPromise = config.show_lastyears_result ? card.client.GetLastYearsResults(race.Circuit.circuitName) : Promise.resolve(null);

    const promises = Promise.all([weatherPromise, lastYearPromise]);
    
    return html`${until(promises.then(([weather, lastYearData]) => {
        const weatherData = weather?.days[0];

        const raceDate = new Date(race.date + 'T' + race.time);
        const weatherInfo = renderWeatherInfo(weatherData, config, raceDateTime ?? raceDate);
        const lastYearsResult = renderLastYearsResults(config, lastYearData)

        const freePractice1Datetime = race.FirstPractice !== undefined ? new Date(race.FirstPractice.date + 'T' + race.FirstPractice.time) : null;
        const freePractice2Datetime = race.SecondPractice !== undefined ? new Date(race.SecondPractice.date + 'T' + race.SecondPractice.time) : null;
        const freePractice3Datetime = race.ThirdPractice !== undefined ? new Date(race.ThirdPractice.date + 'T' + race.ThirdPractice.time) : null;
        const qualifyingDatetime = race.Qualifying !== undefined ? new Date(race.Qualifying.date + 'T' + race.Qualifying.time) : null;
        const sprintQualifyingDatetime = race.SprintQualifying !== undefined ? new Date(race.SprintQualifying.date + 'T' + race.SprintQualifying.time) : null;
        const sprintDatetime = race.Sprint !== undefined ? new Date(race.Sprint.date + 'T' + race.Sprint.time) : null;

        const freePractice1 = race.FirstPractice !== undefined ? formatDateTimeRaceInfo(freePractice1Datetime, hass.locale) : '-';
        const freePractice2 = race.SecondPractice !== undefined ? formatDateTimeRaceInfo(freePractice2Datetime, hass.locale) : '-';
        const freePractice3 = race.ThirdPractice !== undefined ? formatDateTimeRaceInfo(freePractice3Datetime, hass.locale) : '-';
        const raceDateFormatted = formatDateTimeRaceInfo(raceDate, hass.locale);
        const qualifyingDate = formatDateTimeRaceInfo(qualifyingDatetime, hass.locale);
        const sprintDate = race.Sprint !== undefined ? formatDateTimeRaceInfo(sprintDatetime, hass.locale) : '-';
        const sprintQualifyingDate = race.SprintQualifying !== undefined ? formatDateTimeRaceInfo(sprintQualifyingDatetime, hass.locale) : '-';



        const events: { date: Date, name: string, value: string }[] = [];
        events.push({ date: freePractice1Datetime, name: card.translation('practice1'), value: freePractice1 });
        events.push({ date: freePractice2Datetime, name: card.translation('practice2'), value: freePractice2 });
        events.push({ date: freePractice3Datetime, name: card.translation('practice3'), value: freePractice3 });
        events.push({ date: qualifyingDatetime, name: card.translation('qualifying'), value: qualifyingDate });
        events.push({ date: sprintQualifyingDatetime, name: card.translation('sprint_qualifying'), value: sprintQualifyingDate });
        events.push({ date: sprintDatetime, name: card.translation('sprint'), value: sprintDate });
        events.push({ date: raceDate, name: card.translation('racetime'), value: raceDateFormatted });

        const filteredEvents = events.filter(event => event.date !== null).sort((a, b) => a.date.getTime() - b.date.getTime()); 
        
        return html`${lastYearsResult}${weatherInfo}<tr><td>${card.translation('date')}</td><td>${formatDateNumeric(raceDate, hass.locale, config.date_locale)}</td><td>&nbsp;</td><td>${renderEventColumn(0, 'name', filteredEvents)}</td><td align="right">${renderEventColumn(0, 'value', filteredEvents)}</td></tr>
                    <tr><td>${card.translation('race')}</td><td>${race.round}</td><td>&nbsp;</td><td>${renderEventColumn(1, 'name', filteredEvents)}</td><td align="right">${renderEventColumn(1, 'value', filteredEvents)}</td></tr>
                    <tr><td>${card.translation('racename')}</td><td>${race.raceName}</td><td>&nbsp;</td><td>${renderEventColumn(2, 'name', filteredEvents)}</td><td align="right">${renderEventColumn(2, 'value', filteredEvents)}</td></tr>
                    <tr><td>${card.translation('circuitname')}</td><td>${race.Circuit.circuitName}</td><td>&nbsp;</td><td>${renderEventColumn(3, 'name', filteredEvents)}</td><td align="right">${renderEventColumn(3, 'value', filteredEvents)}</td></tr>
                    <tr><td>${card.translation('location')}</td><td>${race.Circuit.Location.country}</td><td>&nbsp;</td><td>${renderEventColumn(4, 'name', filteredEvents)}</td><td align="right">${renderEventColumn(4, 'value', filteredEvents)}</td></tr>        
                    <tr><td>${card.translation('city')}</td><td>${race.Circuit.Location.locality}</td><td>&nbsp;</td><td>${renderEventColumn(5, 'name', filteredEvents)}</td><td align="right">${renderEventColumn(5, 'value', filteredEvents)}</td></tr>`;
    }))}`;
}

export const renderEventColumn = (index: number, lookupKey: string, events: { date: Date, name: string, value: string }[]) => {
 
    if (events.length > index) {
        if(lookupKey === 'name') 
            return events[index].name;

        if(lookupKey === 'value') 
            return events[index].value;
    }

    return '-';
};

export const renderLastYearsResults = (config: FormulaOneCardConfig, raceData: Race) => {
    if(!raceData) {
        return html``;
    }

    const result = raceData.Results ? raceData.Results[0] : null;
    const fastest = raceData.Results?.filter((result) => result.FastestLap?.rank === '1')[0];

    return html`<tr>
        <td colspan="5">
            <table class="weather-info">
                <tr>
                    <td class="text-center">
                        <h1 class="${(config.f1_font ? 'formulaone-font' : '')}">${new Date(raceData.date).getFullYear()}</h1>
                        <h2 class="${(config.f1_font ? 'formulaone-font' : '')}">
                            <ha-icon slot="icon" icon="mdi:trophy-outline"></ha-icon> ${result?.Driver.givenName} ${result?.Driver.familyName} (${result?.Constructor.name})
                        </h2>
                        <h3 class="${(config.f1_font ? 'formulaone-font' : '')}">
                            <ha-icon slot="icon" icon="mdi:timer-outline"></ha-icon> ${fastest?.Driver.givenName} ${fastest?.Driver.familyName} (${fastest?.FastestLap?.Time.time})
                        </h3>
                    </td>
                </tr>
            </table>
        </td>
        <tr><td colspan="5">&nbsp;</td></tr>`;
}

export const renderWeatherInfo = (weatherData: Day, config: FormulaOneCardConfig, raceDate: Date) => {
    if(!weatherData) {
        return html``;
    }

    const windUnit = config.weather_options?.unit === WeatherUnit.Metric ? 'km/h' : 'mph';
    const tempUnit = config.weather_options?.unit === WeatherUnit.MilesFahrenheit ? '°F' : '°C';
    const hourData = weatherData.hours ? weatherData.hours[raceDate.getHours()] : weatherData as Hour;    

    return html`<tr>
                    <td colspan="5">
                        <table class="weather-info">
                            <tr>
                                <td><ha-icon slot="icon" icon="mdi:weather-windy"></ha-icon> ${calculateWindDirection(hourData.winddir)} ${hourData.windspeed} ${windUnit}</td>
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
}

export const calculateWindDirection = (windDirection: number) => {
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
      { label: 'N', range: [348.75, 360]}
    ];
  
    for (const { label, range } of directions) {
      if (windDirection >= range[0] && windDirection <= range[1]) {
        return label;
      }
    }
}

export const getRefreshTime = (endpoint: string) => {
    let refreshCacheHours = 24;
    const now = new Date();
    const scheduleLocalStorage = localStorage.getItem(`${now.getFullYear()}.json`);

    if(scheduleLocalStorage) {
        const item: LocalStorageItem = <LocalStorageItem>JSON.parse(scheduleLocalStorage);
        const schedule = <Root>JSON.parse(item.data);
        const filteredRaces = schedule.MRData.RaceTable.Races.filter(race => new Date(race.date).toLocaleDateString == now.toLocaleDateString);
        
        if(filteredRaces.length > 0) {
            const todaysRace = filteredRaces[0];
            const raceTime = new Date(todaysRace.date + 'T' + todaysRace.time);
            
            const lastResultLocalStorage = localStorage.getItem(endpoint);  
            if(lastResultLocalStorage) {
                const resultItem: LocalStorageItem = <LocalStorageItem>JSON.parse(lastResultLocalStorage);
                
                if(new Date(resultItem.created) < raceTime) {
                    refreshCacheHours = 1;
                }
            }          
        }
    }

    return refreshCacheHours;
}

export const reduceArray = <T>(array?: T[], number?: number) => {
    if(array === undefined) {
        return [];
    }

    return number ? array.slice(0, number) : array;
}

export const renderConstructorColumn = (card: BaseCard, constructor: Constructor): HTMLTemplateResult => {
    return html`<td>${(card.config.standings.show_teamlogo ? html`<img class="constructor-logo" height="20" width="20" src="${getTeamImage(card, constructor.constructorId)}">&nbsp;` : '')}${constructor.name}</td>`;
}

export const translateStatus = (status: string, config: FormulaOneCardConfig) => {
    const defaultTranslations: Translation = {
        'Finished' : 'Finished',
        '+1 Lap' : '+1 Lap',
        'Engine' : 'Engine',
        '+2 Laps' : '+2 Laps',
        'Accident' : 'Accident',
        'Collision' : 'Collision',
        'Gearbox' : 'Gearbox',
        'Spun off' : 'Spun off',
        '+3 Laps' : '+3 Laps',
        'Suspension' : 'Suspension',
        '+4 Laps' : '+4 Laps',
        'Transmission' : 'Transmission',
        'Electrical' : 'Electrical',
        'Brakes' : 'Brakes',
        'Withdrew' : 'Withdrew',
        '+5 Laps' : '+5 Laps',
        'Clutch' : 'Clutch',
        'Lapped' : 'Lapped',
        'Retired' : 'Retired',
        'Not classified' : 'Not classified',
        'Fuel system' : 'Fuel system',
        '+6 Laps' : '+6 Laps',
        'Disqualified' : 'Disqualified',
        'Turbo' : 'Turbo',
        'Hydraulics' : 'Hydraulics',
        'Overheating' : 'Overheating',
        'Ignition' : 'Ignition',
        'Oil leak' : 'Oil leak',
        'Throttle' : 'Throttle',
        'Out of fuel' : 'Out of fuel'
    };

    if(!config.translations || Object.keys(config.translations).indexOf(status) < 0) {
        return defaultTranslations[status];
    }

    return config.translations[status]
}
