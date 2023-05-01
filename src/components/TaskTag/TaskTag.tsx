import React, {FC} from "react";
import "./TaskTag.css"

interface TaskTagProps {
    name: string,
    isColored?: boolean
}

const TaskTag: FC<TaskTagProps> = ({name, isColored = true}) => {

    let tag_color: string = ""

    if (isColored) {
        switch (name) {

            case("home"):
                tag_color = "green"
                break;

            case("work"):
                tag_color = "purple"
                break;

            case("health"):
                tag_color = "blue"
                break;

            case("other"):
                tag_color = "orange"
                break;

            default:
                tag_color = "red"
        }
    }

    return (
        <div className={`task-tag task-tag--${tag_color}`}>{name}</div>
    )
}

export default TaskTag
