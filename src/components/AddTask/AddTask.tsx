import React, {FC, useRef, useState} from "react";
import CustomCheckInput from "../CustomCheckInput/CustomCheckInput";
import TaskTag from "../TaskTag/TaskTag";
import Loading from "../Loading/Loading";
import "./AddTask.css"

interface AddTaskProps {
    closeModal: () => void,
    addTask: (title: string, tag: string, date: string) => void,
}

const AddTask: FC<AddTaskProps> = ({addTask, closeModal}) => {

    const date_ref = useRef<HTMLInputElement>(null)

    const tag_home_ref = useRef<HTMLInputElement>(null)
    const tag_health_ref = useRef<HTMLInputElement>(null)
    const tag_work_ref = useRef<HTMLInputElement>(null)
    const tag_other_ref = useRef<HTMLInputElement>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [titleState, setTitleState] = useState<string>("")

    const today = new Date()

    const addTaskHandler = () => {
        setIsLoading(true)
        const title = titleState
        const date = date_ref.current?.value || ""

        let tag: string = ""

        if (tag_home_ref.current?.checked) {
            tag = tag_home_ref.current.value
        }
        if (tag_health_ref.current?.checked) {
            tag = (tag_health_ref.current.value)
        }
        if (tag_work_ref.current?.checked) {
            tag = (tag_work_ref.current.value)
        }
        if (tag_other_ref.current?.checked) {
            tag = (tag_other_ref.current.value)
        }

        addTask(title, tag, date)
        closeModal()
    }

    const handleTitleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement

        setTitleState(target.value)
    }

    return (
        <div className={`add-task ${isLoading ? "add-task--loading" : null}`}>
            <h3 className={"add-task__title"}>Add Task</h3>
            <input placeholder={"Task Title"} className={"text-input add-task__input"} type={"text"} value={titleState}
                   onInput={handleTitleChange}></input>

            <div className={"add-task__options"}>
                <form className={"add-task__tag-list"}>
                    <CustomCheckInput name={'tag'} value={"home"} outline={"#639462"} type={"radio"}
                                      input_element={<TaskTag name={"home"}/>} ref_check={tag_home_ref}/>
                    <CustomCheckInput name={'tag'} value={"health"} outline={"#0053CF"} type={"radio"}
                                      input_element={<TaskTag name={"health"}/>} ref_check={tag_health_ref}/>
                    <CustomCheckInput name={'tag'} value={"work"} outline={"#9747FF"} type={"radio"}
                                      input_element={<TaskTag name={"work"}/>} ref_check={tag_work_ref}/>
                    <CustomCheckInput name={'tag'} value={"other"} outline={"#EA8C00"} type={"radio"}
                                      isDefault={true} input_element={<TaskTag name={"other"}/>}
                                      ref_check={tag_other_ref}/>
                </form>

                <input className={"add-task__date"} type={"date"} ref={date_ref}
                       defaultValue={`${today.toLocaleDateString('en-CA')}`}/>
            </div>

            <div className={"add-task__buttons"}>
                <button className={"button button--isTransparent add-task__cancel-button"}
                        onClick={closeModal}>Cancel
                </button>
                <button className={"button add-task__ok-button"} onClick={addTaskHandler}
                        disabled={titleState.length < 1}>Add Task
                </button>
            </div>

            {isLoading ? <Loading/> : null}

        </div>
    )
}

export default AddTask