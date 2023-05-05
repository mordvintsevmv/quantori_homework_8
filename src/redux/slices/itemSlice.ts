import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Item} from "../../types/Item";
import {serverFetchItems} from "../../api/itemsAPI";
import axios from "axios";
import {isTodayTasksShown} from "../../commonScripts/checkTodayShown";
import {statusType} from "../../types/statusType";

interface ItemState {
    items: Item[],
    status: statusType,
    error: string | null,
    isTodayShown: boolean
}

const initialState: ItemState = {
    items: [],
    status: statusType.IDLE,
    error: null,
    isTodayShown: isTodayTasksShown()
}

export const fetchItems = createAsyncThunk(
    'items/fetchItems',
    async (arg, thunkAPI) => {
        try {
            const response = await serverFetchItems()
            return thunkAPI.fulfillWithValue(response)
        } catch (error) {
            if (axios.isAxiosError(error))
                return thunkAPI.rejectWithValue(error.message)
            else
                return thunkAPI.rejectWithValue(`Unexpected error`)
        }
    }
)

export const itemSlice = createSlice({
    name: "Items",
    initialState,
    reducers: {
        setTodayShown: (state, action) => {
            state.isTodayShown = action.payload
            localStorage.setItem('TodayTaskLastShown', JSON.stringify(new Date()))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchItems.pending, (state) => {
            state.status = statusType.LOADING
        })

        builder.addCase(fetchItems.fulfilled, (state, action) => {
            state.status = statusType.SUCCESS;
            state.items = action.payload
        })

        builder.addCase(fetchItems.rejected, (state, action) => {
            state.status = statusType.ERROR;
            if (typeof action.payload === "string")
                state.error = action.payload
            else
                state.error = "Unknown error"
        })
    }
})

export const itemReducer = itemSlice.reducer
export const {setTodayShown} = itemSlice.actions