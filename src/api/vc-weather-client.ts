import { WeatherOptions, WeatherUnit } from '../types/formulaone-card-types';
import { ClientBase } from './client-base';
import { Race } from './f1-models';
import { IWeatherClient, WeatherData, WeatherResponse } from './weather-models';

export default class VCWeatherClient
    extends ClientBase
    implements IWeatherClient
{
    private readonly apiKey: string;
    private readonly unitGroup: string = 'metric';
    baseUrl =
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

    constructor(apiKey: string, unitGroup?: string) {
        super();
        this.apiKey = apiKey;
        this.unitGroup = unitGroup ?? this.unitGroup;
    }

    async getRaceWeatherData(options: WeatherOptions, race: Race): Promise<WeatherData> {
        const endpoint = `${race.Circuit.Location.lat}, ${ race.Circuit.Location.long}/${race.date}T${race.time}`;
        const contentType = 'json';

        const url = `${endpoint}?unitGroup=${this.unitGroup}&key=${this.apiKey}&contentType=${contentType}`;

        const data = await this.GetData<WeatherResponse>(url, true, 1);   

        const day = data?.days[0]

        return { 
            race_temperature: day.temp,
            race_temperature_unit: options.unit === WeatherUnit.Metric ? 'celsius' : 'fahrenheit',
            race_humidity: day.humidity,
            race_humidity_unit: '%',
            race_cloud_cover: day.cloudcover,
            race_cloud_cover_unit: '%',
            race_precipitation: day.precip,
            race_precipitation_unit : 'mm',
            race_wind_speed : day.windspeed,
            race_wind_speed_unit : 'm/s',
            race_wind_direction: this.calculateWindDirection(day.winddir),  
            race_wind_from_direction_degrees: day.winddir,
            race_wind_from_direction_unit: 'degrees',
            race_feelslike: day.feelslike,
            race_feelslike_unit: options.unit === WeatherUnit.Metric ? 'celsius' : 'fahrenheit',
            race_precipitation_prob: day.precipprob,
            icon: '',
            friendly_name: 'visualcrossing', 
        };
    }

    private calculateWindDirection = (windDirection: number) => {
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
            { label: 'N', range: [348.75, 360] },
        ];

        for (const { label, range } of directions) {
            if (windDirection >= range[0] && windDirection <= range[1]) {
                return label;
            }
        }
    };
}
