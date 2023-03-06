import { ClientBase } from "./client-base";
import { WeatherResponse } from "./weather-models";

export default class WeatherClient extends ClientBase {
  private readonly apiKey: string;
  private readonly unitGroup: string = 'metric';
  baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  constructor(apiKey: string, unitGroup?: string) {
    super();
    this.apiKey = apiKey;
    this.unitGroup = unitGroup ?? this.unitGroup;
  }

  async getWeatherData(latitude: string, longitude: string, date: string) : Promise<WeatherResponse> {
    const endpoint = `${latitude},${longitude}/${date}`;
    const contentType = 'json';

    const url = `${endpoint}?unitGroup=${this.unitGroup}&key=${this.apiKey}&contentType=${contentType}`;

    const data = await this.GetData<WeatherResponse>(url, true, 1);

    return data;
  }
}
