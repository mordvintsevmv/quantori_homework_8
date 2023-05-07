import {FC, memo} from "react";
import "./Header.css"
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";
import {updateTheme} from "../../redux/slices/themeSlice";

import dark_mode from "./assets/dark_mode.svg"
import light_mode from "./assets/light_mode.svg"

interface HeaderProps {
    title: string
}

const Header: FC<HeaderProps> = memo(({title}) => {

    const theme = useTypedSelector(state => state.theme)
    const dispatch = useTypedDispatch()

    const handleTheme = () => {
        console.log("BEFORE", theme)
        dispatch(updateTheme(theme === "dark" ? "light" : "dark"))
    }

    return (
        <div className={"Header"}>

            <h1 className={"Header__title"}>{title}</h1>

            <button onClick={handleTheme} className={"icon-button Header__theme-toggle"}>
                <img className={""} src={theme === "dark" ? light_mode : dark_mode}
                     alt={theme === "dark" ? "Turn Light Mode" : "Turn Dark Mode"}/>
            </button>

            <WeatherWidget className={"Header__weather"}/>
        </div>
    )
})

export default Header