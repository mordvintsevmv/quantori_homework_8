import {FC, memo} from "react";
import "./Header.css"
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";
import {updateTheme} from "../../redux/slices/themeSlice";

import dark_mode from "./assets/dark_mode.svg"
import light_mode from "./assets/light_mode.svg"
import IconButton from "../BaseComponents/IconButton";

interface HeaderProps {
    title: string
}

const Header: FC<HeaderProps> = memo(({title}) => {

    const theme = useTypedSelector(state => state.theme)

    const dispatch = useTypedDispatch()

    const handleTheme = () => {
        dispatch(updateTheme(theme === "dark" ? "light" : "dark"))
    }

    return (
        <div className={"Header"}>

            <h1 className={"Header__title"}>{title}</h1>

            <IconButton
                className={"Header__theme-toggle"}
                src={theme === "dark" ? light_mode : dark_mode}
                alt={theme === "dark" ? "Turn Light Mode" : "Turn Dark Mode"}
                onClick={handleTheme}
                size={"l"}
            />

            <WeatherWidget className={"Header__weather"}/>
        </div>
    )
})

export default Header