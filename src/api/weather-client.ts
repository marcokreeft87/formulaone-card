import { ClientBase } from "./client-base";
import { WeatherResponse } from "./weather-models";

export default class WeatherClient extends ClientBase {
  private readonly apiKey: string;
  baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async getWeatherData(latitude: string, longitude: string, date: string) : Promise<WeatherResponse> {
    const endpoint = `${latitude},${longitude}/${date}`;
    const unitGroup = 'metric';
    const contentType = 'json';

    const url = `${endpoint}?unitGroup=${unitGroup}&key=${this.apiKey}&contentType=${contentType}`;

    const data = await this.GetData<WeatherResponse>(url, true, 3);

    return data;
  }

  async getWeatherDataRange(latitude: string, longitude: string, startDate: string, endDate: string) : Promise<WeatherResponse> {
    const endpoint = `${latitude},${longitude}/${startDate}/${endDate}`;
    const unitGroup = 'metric';
    const contentType = 'json';

    const url = `${endpoint}?unitGroup=${unitGroup}&key=${this.apiKey}&contentType=${contentType}`;

    const data = await this.GetData<WeatherResponse>(url, true, 24);

    return data;
  }
}
