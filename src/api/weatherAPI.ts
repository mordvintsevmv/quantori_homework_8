import {WeatherResponse} from "../types/WeatherResponse";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const axiosWeatherConfig: AxiosRequestConfig = {
    baseURL: 'https://api.weatherapi.com/v1',
}

export const weatherAPI = axios.create(axiosWeatherConfig)

const weather_api_key: string = '8b1638203941464fb58170357231404'

export const getWeather = async (location: string): Promise<WeatherResponse> => {
    return await weatherAPI.get(`current.json?key=${weather_api_key}&q=${location}&aqi=no`)
        .then((response: AxiosResponse<WeatherResponse>) => {
            return response.data
        })
}

export const getCurrentPosition = async (): Promise<string> => {
    return new Promise((resolve): void => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => resolve(position.coords.latitude + ',' + position.coords.longitude),
            () => resolve('Tbilisi')
        )
    })
}