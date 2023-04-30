import {FC, useRef} from "react";
import "./AddTask.css"
import CustomCheckInput from "../CustomCheckInput/CustomCheckInput";
import TaskTag from "../TaskTag/TaskTag";

interface AddTaskProps {
    closeModal: () => void,
    addTask: (title: string, tag: string[], date: string) => void
}

const AddTask: FC<AddTaskProps> = ({closeModal, addTask}) => {

    const title_ref = useRef<HTMLInputElement>(null)
    const date_ref = useRef<HTMLInputElement>(null)

    const tag_home_ref = useRef<HTMLInputElement>(null)
    const tag_health_ref = useRef<HTMLInputElement>(null)
    const tag_work_ref = useRef<HTMLInputElement>(null)
    const tag_other_ref = useRef<HTMLInputElement>(null)
    const tag_custom_check_ref = useRef<HTMLInputElement>(null)
    const tag_custom_input_ref = useRef<HTMLInputElement>(null)

    const today: Date = new Date()

    const addTaskHandler = () => {
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
        if (tag_custom_check_ref.current?.checked && tag_custom_input_ref.current) {
            tag.push(tag_custom_input_ref.current.value)
        }

        addTask(title, tag, date)
    }
    return (
        <div className={"add-task"}>
            <h3 className={"add-task__title"}>Add New Task</h3>
            <input placeholder={"Task Title"} className={"text-input add-task__input"} ref={title_ref}></input>

            <div className={"add-task__options"}>
                <form className={"add-task__tag-list"}>
                    <CustomCheckInput name={'tag'} value={"home"} outline={"#639462"} type={"checkbox"}
                                      input_element={<TaskTag name={"home"}/>} ref_check={tag_home_ref}/>
                    <CustomCheckInput name={'tag'} value={"health"} outline={"#0053CF"} type={"checkbox"}
                                      input_element={<TaskTag name={"health"}/>} ref_check={tag_health_ref}/>
                    <CustomCheckInput name={'tag'} value={"work"} outline={"#9747FF"} type={"checkbox"}
                                      input_element={<TaskTag name={"work"}/>} ref_check={tag_work_ref}/>
                    <CustomCheckInput name={'tag'} value={"other"} outline={"#EA8C00"} type={"checkbox"}
                                      isDefault={true} input_element={<TaskTag name={"other"}/>}
                                      ref_check={tag_other_ref}/>
                    <CustomCheckInput name={'tag'} value={"..."} outline={"#EF3F3E"} type={"checkbox"}
                                      input_element={<TaskTag name={"..."}/>} ref_check={tag_custom_check_ref}
                                      ref_input={tag_custom_input_ref} isEdit={true}/>
                </form>

                <input className={"add-task__date"} type={"date"} ref={date_ref}
                       defaultValue={`${today.toLocaleDateString('en-CA')}`}/>
            </div>

            <div className={"add-task__buttons"}>
                <button className={"button button--isTransparent add-task__cancel-button"} onClick={closeModal}>Cancel
                </button>
                <button className={"button add-task__add-button"} onClick={addTaskHandler}>Add Task</button>
            </div>
        </div>
    )
}

export default AddTask