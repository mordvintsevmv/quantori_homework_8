import React, {FC} from "react";
import "./TaskTag.css"
import {useTypedSelector} from "../../hooks/reduxHooks";

interface TaskTagProps {
    name: string,
    isColored?: boolean,
    isEdit?: boolean
    ref_input?: React.Ref<HTMLInputElement>
}

const TaskTag: FC<TaskTagProps> = ({name, isColored = true, isEdit = false, ref_input}) => {

    const theme = useTypedSelector(state => state.theme)

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

    const handleInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement
        target.style.width = (target.value.length * 6).toString() + "px"
    }

    if (isEdit) {
        return (
            <div className={`task-tag task-tag--${theme}-${tag_color}`}>
                <input
                    className={"task-tag__input"}
                    type={"text"} placeholder={name}
                    onInput={handleInput}
                    ref={ref_input}/>
            </div>
        )
    } else {
        return (
            <div className={`task-tag task-tag--${theme}-${tag_color}`}>{name}</div>
        )
    }
}

export default TaskTag
