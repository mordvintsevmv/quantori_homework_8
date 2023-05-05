import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {WeatherState} from "../../types/State";
import {getWeather} from "../../api/weatherAPI";
import axios from "axios";
import {statusType} from "../../types/statusType";

interface WeatherSliceState {
    weather: WeatherState,
    status: statusType,
    error: string | null
}

const initialState: WeatherSliceState = {
    weather: {city: '', temp_c: '', weather_icon: '', weather_text: ''},
    status: statusType.IDLE,
    error: null
}

export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async (location: string, thunkAPI) => {
        try {
            const response = await getWeather(location)
            return thunkAPI.fulfillWithValue(response)
        } catch (error) {
            if (axios.isAxiosError(error))
                return thunkAPI.rejectWithValue(error.message)
            else
                return thunkAPI.rejectWithValue(`Unexpected error`)
        }

    }
)

const weatherSlice = createSlice({
    name: "Weather",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchWeather.pending, (state) => {
            state.status = statusType.LOADING
        })

        builder.addCase(fetchWeather.fulfilled, (state, action) => {
            state.status = statusType.SUCCESS;
            state.weather = {
                city: action.payload.location.name,
                temp_c: action.payload.current.temp_c + "°",
                weather_icon: action.payload.current.condition.icon,
                weather_text: action.payload.current.condition.text
            }
        })

        builder.addCase(fetchWeather.rejected, (state, action) => {
            state.status = statusType.ERROR;
            if (typeof action.payload === "string")
                state.error = action.payload
            else
                state.error = "Unknown error"
        })
    }
})

export const weatherReducer = weatherSlice.reducer