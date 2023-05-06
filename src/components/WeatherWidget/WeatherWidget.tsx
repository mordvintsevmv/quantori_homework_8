import {FC, useEffect} from "react";
import "./WeatherWidget.css"
import {getCurrentPosition} from "../../api/weatherAPI";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";
import {fetchWeather} from "../../redux/slices/weatherSlice";
import error_icon from "./assets/error.svg"
import {statusType} from "../../types/statusType";

const WeatherWidget: FC = () => {

    const dispatch = useTypedDispatch()
    const {weather, status, error} = useTypedSelector(state => state.weather)
    const theme = useTypedSelector(state => state.theme)

    const isLoading = [statusType.IDLE, statusType.LOADING].includes(status)

    useEffect(() => {
        getCurrentPosition().then((location) => dispatch(fetchWeather(location)))
    }, [dispatch])

    return (
        <div className={`weather-widget weather-widget--${theme}`}>
            <img className={`weather-widget__icon ${isLoading ? "skeleton skeleton-img" : null}`}
                 src={error ? error_icon : weather.weather_icon} alt={error ? "Error" : weather.weather_text}/>
            <div
                className={`weather-widget__location ${isLoading ? "skeleton skeleton-text" : null}`}>{error ? error : weather.city}</div>
            <div
                className={`weather-widget__temp ${isLoading ? "skeleton skeleton-text" : null}`}>{error ? "" : weather.temp_c}</div>
        </div>
    )
}

export default WeatherWidget