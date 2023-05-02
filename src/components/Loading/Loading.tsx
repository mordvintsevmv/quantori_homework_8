import {FC} from "react";
import "./Loading.css"
import loading from "./assets/loading.gif"

const Loading: FC = () => {
    return (
        <div className={"loading-wrapper"}>
            <img src={loading} className={"loading-gif"} alt={"loading"}/>
        </div>
    )
}

export default Loading