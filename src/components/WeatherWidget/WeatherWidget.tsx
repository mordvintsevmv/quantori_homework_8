import {FC, useEffect, useState} from "react";
import "./WeatherWidget.css"
import {getWeather} from "../../api/weatherAPI";
import {WeatherResponse} from "../../types/WeatherResponse";
import {WeatherState} from "../../types/State";

const WeatherWidget: FC = () => {

    const [weather, setWeather] = useState<WeatherState>({city: '', temp_c: '', weather_icon: '', weather_text: ''})
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition): void => {
                getWeather(position.coords.latitude + ',' + position.coords.longitude)
                    .then((response: WeatherResponse): void => {
                            setWeather({
                                city: response.location.name,
                                temp_c: response.current.temp_c + "°",
                                weather_icon: response.current.condition.icon,
                                weather_text: response.current.condition.text
                            })
                            setIsLoading(false)
                        }
                    )
            },
            (): void => {
                getWeather("Tbilisi")
                    .then((response: WeatherResponse): void => {
                            setWeather({
                                city: response.location.name,
                                temp_c: response.current.temp_c + "°",
                                weather_icon: response.current.condition.icon,
                                weather_text: response.current.condition.text
                            })
                            setIsLoading(false)
                        }
                    )
            }
        )
    }, [])

    return (
        <div className={"weather-widget"}>
            <img className={isLoading ? "weather-widget__icon skeleton skeleton-img" : "weather-widget__icon"} src={weather.weather_icon} alt={weather.weather_text}/>
            <div className={isLoading ? "weather-widget__location skeleton skeleton-text" : "weather-widget__location"}>{weather.city}</div>
            <div className={isLoading ? "weather-widget__temp skeleton skeleton-text" : "weather-widget__temp"}>{weather.temp_c}</div>
        </div>
    )
}

export default WeatherWidget