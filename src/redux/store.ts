import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {itemReducer} from "./slices/itemSlice";
import {weatherReducer} from "./slices/weatherSlice";
import {createStateSyncMiddleware, initStateWithPrevTab, withReduxStateSync} from "redux-state-sync";

const reducer = withReduxStateSync(combineReducers({
    items: itemReducer,
    weather: weatherReducer
}))

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createStateSyncMiddleware()),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

initStateWithPrevTab(store);