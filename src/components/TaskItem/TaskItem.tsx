import {FC, memo, useRef, useState} from "react";
import {Item} from "../../types/Item";
import "./TaskItem.css"

import checkbox_unchecked_icon from './assets/checkbox-unchecked.svg'
import checkbox_disabled_icon from "./assets/checkbox-disabled.svg"
import trash_icon from "./assets/delete-new-value.svg"

import edit_icon from "./assets/edit.svg"

import arrow_closed from "./assets/arrow_closed.svg"
import arrow_opened from "./assets/arrow_opened.svg"

import TaskTag from "../TaskTag/TaskTag";
import {Link} from "react-router-dom";
import {serverCreateSubtask, serverDeleteItem, serverUpdateItem} from "../../api/itemsAPI";
import {useTypedDispatch} from "../../hooks/reduxHooks";
import {fetchItems} from "../../redux/slices/itemSlice";
import Subtask from "./Subtask/Subtask";

const month_array: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const day_array: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface TaskItemProps {
    item: Item,
}

const TaskItem: FC<TaskItemProps> = memo(({item}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const dispatch = useTypedDispatch()

    // Parsing date (for situations when there is string instead of Date)
    const parsed_date: Date = new Date(Date.parse(item.date_complete))
    const today: Date = new Date();

    const description_ref = useRef<HTMLTextAreaElement>(null)

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

    const handleCheck = () => {
        setIsLoading(true);
        serverUpdateItem(item.id, {isChecked: !item.isChecked})
            .then(() => dispatch(fetchItems()))
    }

    const handleDelete = () => {
        setIsLoading(true);
        serverDeleteItem(item.id)
            .then(() => dispatch(fetchItems()))
    }

    const handleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const handleDescription = () => {
        serverUpdateItem(item.id, {description: description_ref.current?.value})
            .then(() => dispatch(fetchItems()))
    }

    const handleCreate = () => {
        serverCreateSubtask(item.id, {
            id: crypto.randomUUID(),
            title: "",
            isChecked: false
        })
            .then(() => dispatch(fetchItems()))
    }

    return (
        <>
            <div className={`task-item ${isLoading ? "task-item--loading" : null}`}>

                <button className={"task-item__checkbox"} onClick={handleCheck}>
                    <img
                        className={`task-item__checkbox-img ${item.isChecked ? "task-item__checkbox-img--checked" : "task-item__checkbox-img--unchecked"}`}
                        src={item.isChecked ? checkbox_disabled_icon : checkbox_unchecked_icon}
                        alt={item.isChecked ? "Uncheck" : "Check"}/>
                </button>

                <div className={"task-item__info"}>
                    <h3 className={`task-item__title`} onClick={handleExpand}>{item.title}</h3>

                    <div className={`task-item__bottom ${isExpanded ? "task-item__bottom--hidden" : null}`}>
                        <div className={`task-item__tags`}>
                            {tags}
                        </div>
                        <div className={`task-item__date`}>{day_text}</div>
                    </div>
                </div>

                {!item.isChecked &&
                    <div className={"task-item__controls"}>

                        <button className={"task-item__control-item icon-button"}>
                            <Link to={`/edit/${item.id}`}>
                                <img src={edit_icon} alt={"Edit"}/>
                            </Link>
                        </button>

                        <button className={"task-item__control-item icon-button"} onClick={handleDelete}>
                            <img src={trash_icon} alt={"Delete"}/>
                        </button>

                        <button className={"task-item__control-item task-item__control-item--expand icon-button"}
                                onClick={handleExpand}>
                            <img src={isExpanded ? arrow_opened : arrow_closed} alt={"Expand"}/>
                        </button>

                    </div>
                }
            </div>

            {isExpanded && <div className={"task-item__details"}>
                <textarea defaultValue={item.description} placeholder={"Task Description"}
                          className={"task-item__description"} ref={description_ref} onBlur={handleDescription}/>


                <div className={"task-item__subtasks"}>
                    {item.subtasks.map((subtask) => <Subtask item_id={item.id} subtask={subtask} key={subtask.id}/>)}
                    <button className={"task-item__create-subtask"} onClick={handleCreate}>+ Create Subtask</button>
                </div>

                <div className={`task-item__bottom task-item__bottom--expanded`}>
                    <div className={`task-item__tags`}>
                        {tags}
                    </div>
                    <div className={`task-item__date`}>{day_text}</div>
                </div>

            </div>}
        </>
    )
})

export default TaskItem