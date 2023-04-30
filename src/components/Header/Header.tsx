import {FC} from "react";
import "./Header.css"
import WeatherWidget from "../WeatherWidget/WeatherWidget";

interface HeaderProps {
    title: string
}
const Header: FC<HeaderProps> = ({title}) => {
    return (
        <div className={"Header"}>
            <h1 className={"Header__title"}>{title}</h1>
            <WeatherWidget/>
        </div>
    )
}

export default Header