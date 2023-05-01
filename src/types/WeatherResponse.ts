export interface WeatherResponse {
    "location": Weather_location,
    "current": Weather_current
}

interface Weather_location {
    "name": string,
    "region": string,
    "country": string,
    "lat": number,
    "lon": number,
    "tz_id": string,
    "localtime_epoch": number,
    "localtime": string
}

interface Weather_current {
    "last_updated_epoch": number,
    "last_updated": string,
    "temp_c": number,
    "temp_f": number,
    "is_day": number,
    "condition": Weather_current_condition,
    "wind_mph": number,
    "wind_kph": number,
    "wind_degree": number,
    "wind_dir": string,
    "pressure_mb": number,
    "pressure_in": number,
    "precip_mm": number,
    "precip_in": number,
    "humidity": number,
    "cloud": number,
    "feelslike_c": number,
    "feelslike_f": number,
    "vis_km": number,
    "vis_miles": number,
    "uv": number,
    "gust_mph": number,
    "gust_kph": number,
    "air_quality": Weather_current_air
}

interface Weather_current_condition {
    "text": string,
    "icon": string,
    "code": number
}

interface Weather_current_air {
    "co": number,
    "no2": number,
    "o3": number,
    "so2": number,
    "pm2_5": number,
    "pm10": number,
    "us-epa-index": number,
    "gb-defra-index": number
}