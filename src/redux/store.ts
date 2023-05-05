import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {itemReducer} from "./slices/itemSlice";
import {weatherReducer} from "./slices/weatherSlice";

const reducer = combineReducers({
    items: itemReducer,
    weather: weatherReducer
})

export const store = configureStore({
    reducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch