import { ClientBase } from "./client-base";
import { RootObject } from "./weather-models";

export default class WeatherClient extends ClientBase {
    baseUrl: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    apiKey: string;

    constructor(apiKey: string) {
        super();
        
        this.apiKey = apiKey;
    }

    async GetForecast(latitude: string, longitude: string, date: string) {


        fetch(`${this.baseUrl}/${latitude},${longitude}/${date}/${date}?unitGroup=metric&key=${this.apiKey}&contentType=json`, {
           
                headers: {
                  Accept: 'application/json',
                }
        }).then(data => {
        
            console.log(data);
        });

        const data = await this.GetData<RootObject>(`${latitude},${longitude}/${date}/${date}?unitGroup=metric&key=${this.apiKey}&contentType=json`, true, 72);

        return data;
    }
}