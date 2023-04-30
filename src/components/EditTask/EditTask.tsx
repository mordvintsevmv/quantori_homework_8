import {FC, useEffect, useRef} from "react";
import "../AddTask/AddTask.css"
import CustomCheckInput from "../CustomCheckInput/CustomCheckInput";
import TaskTag from "../TaskTag/TaskTag";
import {useNavigate, useParams} from "react-router-dom";
import {load_item_by_id} from "../../api/itemsAPI";


interface EditTaskProps {
    editTask: (id: string, title: string, tag: string[], date: string) => void
}

const EditTask: FC<EditTaskProps> = ({editTask}) => {

    const title_ref = useRef<HTMLInputElement>(null)
    const date_ref = useRef<HTMLInputElement>(null)

    const tag_home_ref = useRef<HTMLInputElement>(null)
    const tag_health_ref = useRef<HTMLInputElement>(null)
    const tag_work_ref = useRef<HTMLInputElement>(null)
    const tag_other_ref = useRef<HTMLInputElement>(null)
    const tag_custom_ref = useRef<HTMLInputElement>(null)


    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            load_item_by_id(id).then((item) => {
                if (title_ref.current) {
                    title_ref.current.value = item.title
                }
                if (date_ref.current) {
                    date_ref.current.value = item.date_complete
                }

                if (item.tag.includes("home") && tag_home_ref.current) {
                    tag_home_ref.current.checked = true
                }

                if (item.tag.includes("health") && tag_health_ref.current) {
                    tag_health_ref.current.checked = true
                }

                if (item.tag.includes("work") && tag_work_ref.current) {
                    tag_work_ref.current.checked = true
                }

                if (item.tag.includes("other") && tag_other_ref.current) {
                    tag_other_ref.current.checked = true
                }

                if (item.tag.includes("...") && tag_custom_ref.current) {
                    tag_custom_ref.current.checked = true
                }


            })
        }
    }, [id])


    const editTaskHandler = () => {
        const title = title_ref.current?.value || ""
        const date = date_ref.current?.value || ""

        let tag: string[] = []

        if (tag_home_ref.current?.checked) {
            tag.push(tag_home_ref.current.value)
        }
        if (tag_health_ref.current?.checked) {
            tag.push(tag_health_ref.current.value)
        }
        if (tag_work_ref.current?.checked) {
            tag.push(tag_work_ref.current.value)
        }
        if (tag_other_ref.current?.checked) {
            tag.push(tag_other_ref.current.value)
        }
        if (tag_custom_ref.current?.checked) {
            tag.push(tag_custom_ref.current.value)
        }

        if (id)
            editTask(id, title, tag, date)

        navigate(-1)
    }

    const handleClose = () => {
        navigate(-1)
    }

    return (
        <div className={"add-task"}>
            <h3 className={"add-task__title"}>Add New Task</h3>
            <input placeholder={"Task Title"} className={"text-input add-task__input"} ref={title_ref}></input>

            <div className={"add-task__options"}>
                <form className={"add-task__tag-list"}>
                    <CustomCheckInput name={'tag'} value={"home"} outline={"#639462"} type={"checkbox"}
                                      input_element={<TaskTag name={"home"}/>} ref_input={tag_home_ref}/>
                    <CustomCheckInput name={'tag'} value={"health"} outline={"#0053CF"} type={"checkbox"}
                                      input_element={<TaskTag name={"health"}/>} ref_input={tag_health_ref}/>
                    <CustomCheckInput name={'tag'} value={"work"} outline={"#9747FF"} type={"checkbox"}
                                      input_element={<TaskTag name={"work"}/>} ref_input={tag_work_ref}/>
                    <CustomCheckInput name={'tag'} value={"other"} outline={"#EA8C00"} type={"checkbox"}
                                      input_element={<TaskTag name={"other"}/>} ref_input={tag_other_ref}/>
                    <CustomCheckInput name={'tag'} value={"..."} outline={"#EF3F3E"} type={"checkbox"}
                                      input_element={<TaskTag name={"..."}/>} ref_input={tag_custom_ref}/>

                </form>

                <input className={"add-task__date"} type={"date"} ref={date_ref}/>
            </div>

            <div className={"add-task__buttons"}>
                <button className={"button button--isTransparent add-task__cancel-button"}
                        onClick={handleClose}>Cancel
                </button>
                <button className={"button add-task__add-button"} onClick={editTaskHandler}>Edit Task</button>
            </div>
        </div>
    )
}

export default EditTask