import {dataFetch} from "./api";
import {WeatherResponse} from "../types/WeatherResponse";

const weatherAPI = dataFetch('https://api.weatherapi.com/v1')

const weather_api_key: string = '8b1638203941464fb58170357231404'

export const getWeather = async (location: string): Promise<WeatherResponse> => {
    return await weatherAPI<WeatherResponse>(`current.json?key=${weather_api_key}&q=${location}&aqi=no`)
}

export const getCurrentPosition = async (): Promise<string> => {
    return new Promise((resolve): void => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => resolve(position.coords.latitude + ',' + position.coords.longitude),
            () => resolve('Tbilisi')
        )
    })
}