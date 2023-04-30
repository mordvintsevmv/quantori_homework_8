import {FC, useState} from "react";
import {Item} from "../../types/Item";
import "./TaskItem.css"

import checkbox_unchecked_icon from './assets/checkbox-unchecked.svg'
import checkbox_disabled_icon from "./assets/checkbox-disabled.svg"
import trash_icon from "./assets/delete-new-value.svg"
import edit_icon from "./assets/edit.svg"

import TaskTag from "../TaskTag/TaskTag";
import {Link} from "react-router-dom";

const month_array: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const day_array: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface TaskItemProps {
    item: Item,
    deleteItem: (id: string) => void,
    checkItem: (id: string) => void
}

const TaskItem: FC<TaskItemProps> = ({item, deleteItem, checkItem}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Parsing date (for situations when there is string instead of Date)
    const parsed_date: Date = new Date(Date.parse(item.date_complete))

    const today: Date = new Date();

    // Creating text for date
    let day_text: string;

    if (parsed_date.getFullYear() === today.getFullYear()
        && parsed_date.getMonth() === today.getMonth()
        && parsed_date.getDate() === today.getDate()
    ) {
        day_text = 'Today'
    } else if (parsed_date.getFullYear() === today.getFullYear()
        && parsed_date.getMonth() === today.getMonth()
        && parsed_date.getDate() - today.getDate() === 1
    ) {
        day_text = 'Tomorrow'
    } else if (parsed_date.getFullYear() === today.getFullYear()
        && parsed_date.getMonth() === today.getMonth()
        && parsed_date.getDate() - today.getDate() === -1
    ) {
        day_text = 'Yesterday'
    } else {
        day_text = `${day_array[parsed_date.getDay()]}, ${parsed_date.getDate()} ${month_array[parsed_date.getMonth()]}`
    }

    const tags: JSX.Element[] = item.tag.map((tag: string) => <TaskTag name={tag} key={tag}
                                                                       isColored={!item.isChecked}/>)

    return (
        <div className={`task-item ${isLoading ? "task-item--loading" : null}`}>

            <button className={"task-item__checkbox"} onClick={() => {
                setIsLoading(true);
                checkItem(item.id)
            }}>
                <img
                    className={item.isChecked ? "task-item__checkbox-img task-item__checkbox-img--checked" : "task-item__checkbox-img task-item__checkbox-img--unchecked"}
                    src={item.isChecked ? checkbox_disabled_icon : checkbox_unchecked_icon}
                    alt={item.isChecked ? "Uncheck" : "Check"}/>
            </button>

            <div className={"task-item__info"}>
                <h3 className={`task-item__title`}>{item.title}</h3>

                <div className={"task-item__bottom"}>
                    <div className={`task-item__tags `}>
                        {tags}
                    </div>
                    <div className={`task-item__date `}>{day_text}</div>
                </div>
            </div>

            {!item.isChecked &&
                <div className={"task-item__controls"}>

                    <button className={"task-item__control-item"}>
                        <Link to={`/edit/${item.id}`}>
                            <img src={edit_icon} alt={"Edit"}/>
                        </Link>
                    </button>

                    <button className={"task-item__control-item"} onClick={() => {
                        setIsLoading(true);
                        deleteItem(item.id)
                    }}>
                        <img src={trash_icon} alt={"Delete"}/>
                    </button>
                </div>
            }
        </div>
    )
}

export default TaskItem