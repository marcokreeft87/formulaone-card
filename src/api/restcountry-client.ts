import { Country } from "../types/rest-country-types";
import { countries } from "../data/countries";

export default class RestCountryClient {

    GetAll() : Country[] {
        return countries;
    }

    GetCountriesFromLocalStorage() : Country[] {
        return countries;
    }
}
