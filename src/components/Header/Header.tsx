import {FC, memo} from "react";
import "./Header.css"
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";
import {updateTheme} from "../../redux/slices/themeSlice";

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
            <>
                <h1 className={"Header__title"}>{title}</h1>
                <button onClick={handleTheme}> CHANGE THEME </button>
            </>

            <WeatherWidget/>
        </div>
    )
})

export default Header