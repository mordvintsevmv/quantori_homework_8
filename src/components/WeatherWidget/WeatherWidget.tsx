import {FC, useEffect, useState} from "react";
import "./WeatherWidget.css"
import {getCurrentPosition, getWeather} from "../../api/weatherAPI";
import {WeatherResponse} from "../../types/WeatherResponse";
import {WeatherState} from "../../types/State";

import error_img from "./assets/error.svg"

const WeatherWidget: FC = () => {

    const [weather, setWeather] = useState<WeatherState>({city: '', temp_c: '', weather_icon: '', weather_text: ''})
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {

        getCurrentPosition().then(
            location => {
                getWeather(location)
                    .then((response: WeatherResponse) => {
                        setWeather({
                            city: response.location.name,
                            temp_c: response.current.temp_c + "°",
                            weather_icon: response.current.condition.icon,
                            weather_text: response.current.condition.text
                        })
                        setIsLoading(false)
                    })
                    .catch(() => {
                        setWeather({
                            city: "Weather API Error",
                            temp_c: "",
                            weather_icon: error_img,
                            weather_text: "Error"
                        })
                        setIsLoading(false)
                    })
            })
    }, [])

    return (
        <div className={"weather-widget"}>
            <img className={`weather-widget__icon ${isLoading ? "skeleton skeleton-img" : null}`}
                 src={weather.weather_icon} alt={weather.weather_text}/>
            <div
                className={`weather-widget__location ${isLoading ? "skeleton skeleton-text" : null}`}>{weather.city}</div>
            <div
                className={`weather-widget__temp ${isLoading ? "skeleton skeleton-text" : null}`}>{weather.temp_c}</div>
        </div>
    )
}

export default WeatherWidget