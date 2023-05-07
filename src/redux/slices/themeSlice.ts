import {createSlice} from "@reduxjs/toolkit";

const getTheme = () => {
    const theme = `${window?.localStorage?.getItem('theme')}`
    if (['light', 'dark'].includes(theme)) return theme

    const userMedia = window.matchMedia('(prefers-color-scheme: light)')
    if (userMedia.matches) return 'light'

    return 'dark'
}

const initialState = getTheme()

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        updateTheme: (state, action) => {
            localStorage.setItem("theme", action.payload)
            return action.payload
        }
    }
})

export const {updateTheme} = themeSlice.actions
export const themeReducer = themeSlice.reducer