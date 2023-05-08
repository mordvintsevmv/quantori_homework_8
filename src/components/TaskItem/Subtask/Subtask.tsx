import {FC, useRef} from "react";
import {ItemSubtask} from "../../../types/Item";
import "./Subtask.css"

import checkbox_checked from "./assets/sub_checkbox_checked.svg"
import checkbox_unchecked from "./assets/sub_checkbox_unchecked.svg"
import {serverDeleteSubtask, serverUpdateSubtask} from "../../../api/itemsAPI";
import {useTypedDispatch} from "../../../hooks/reduxHooks";
import {fetchItems} from "../../../redux/slices/itemSlice";
import trash_icon from "../assets/delete-new-value.svg";
import IconButton from "../../BaseComponents/IconButton";

interface SubtaskProps {
    item_id: string,
    subtask: ItemSubtask
}

const Subtask: FC<SubtaskProps> = ({item_id, subtask}) => {

    const dispatch = useTypedDispatch()

    const title_ref = useRef<HTMLInputElement>(null)

    const handleCheck = () => {
        serverUpdateSubtask(item_id, subtask.id, {isChecked: !subtask.isChecked})
            .then(() => dispatch(fetchItems()))
    }

    const handleTitle = () => {
        serverUpdateSubtask(item_id, subtask.id, {title: title_ref.current?.value})
            .then(() => dispatch(fetchItems()))
    }

    const handleDelete = () => {
        serverDeleteSubtask(item_id, subtask.id)
            .then(() => dispatch(fetchItems()))
    }

    return (
        <div className={"subtask"}>

            <button className={"subtask__checkbox"} onClick={handleCheck}>
                <img
                    className={`subtask__checkbox-img ${subtask.isChecked ? "subtask__checkbox-img--checked" : "subtask__checkbox-img--unchecked"}`}
                    src={subtask.isChecked ? checkbox_checked : checkbox_unchecked}
                    alt={subtask.isChecked ? "Uncheck" : "Check"}/>
            </button>

            <input defaultValue={subtask.title} placeholder={"Subtask Title"}
                   className={`subtask__title ${subtask.isChecked ? "subtask__title--checked" : "subtask__title--unchecked"}`}
                   onBlur={handleTitle} ref={title_ref}/>

            <IconButton
                src={trash_icon}
                onClick={handleDelete}
                alt={"Delete"}
                size={"s"}
            />

        </div>
    )
}

export default Subtask