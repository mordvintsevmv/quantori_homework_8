import React, {FC, useEffect, useRef, useState} from "react";
import CustomCheckInput from "../CustomCheckInput/CustomCheckInput";
import {useNavigate, useParams} from "react-router-dom";
import {load_item_by_id} from "../../api/itemsAPI";
import Loading from "../Loading/Loading";


interface EditTaskProps {
    editTask: (id: string, title: string, tag: string[], date: string) => void
}

const EditTask: FC<EditTaskProps> = ({editTask}) => {

    const date_ref = useRef<HTMLInputElement>(null)

    const tag_home_ref = useRef<HTMLInputElement>(null)
    const tag_health_ref = useRef<HTMLInputElement>(null)
    const tag_work_ref = useRef<HTMLInputElement>(null)
    const tag_other_ref = useRef<HTMLInputElement>(null)
    const tag_custom_check_ref = useRef<HTMLInputElement>(null)
    const tag_custom_input_ref = useRef<HTMLInputElement>(null)


    const {id} = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [titleState, setTitleState] = useState<string>("")

    const today = new Date()


    useEffect(() => {
        if (id) {
            load_item_by_id(id).then((item) => {
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

                if (item.tag.some((tag) => !['home', 'health', "work", "other"].includes(tag)) && tag_custom_check_ref.current && tag_custom_input_ref.current) {
                    tag_custom_check_ref.current.checked = true
                    tag_custom_input_ref.current.value = item.tag.filter((tag) => !['home', 'health', "work", "other"].includes(tag))[0]
                    tag_custom_input_ref.current.style.width = (tag_custom_input_ref.current.value.length * 6).toString() + "px"
                }

                setTitleState(item.title)
                setIsLoading(false)

            })
        }
    }, [id])


    const editTaskHandler = () => {
        setIsLoading(true)
        const title = titleState
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

        if (id)
            editTask(id, title, tag, date)

        navigate(-1)
    }

    const handleClose = () => {
        navigate(-1)
    }

    const handleTitleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement

        setTitleState(target.value)
    }


    return (
        <div className={`configure-task ${isLoading ? "configure-task--loading" : null}`}>
            <h3 className={"configure-task__title"}>Edit Task</h3>
            <input placeholder={"Task Title"} className={"text-input configure-task__input"} type={"text"}
                   value={titleState} onInput={handleTitleChange}></input>

            <div className={"configure-task__options"}>
                <form className={"configure-task__tag-list"}>
                    <CustomCheckInput name={'tag'} value={"home"} outline={"#639462"} type={"checkbox"}
                                      ref_check={tag_home_ref}/>
                    <CustomCheckInput name={'tag'} value={"health"} outline={"#0053CF"} type={"checkbox"}
                                      ref_check={tag_health_ref}/>
                    <CustomCheckInput name={'tag'} value={"work"} outline={"#9747FF"} type={"checkbox"}
                                      ref_check={tag_work_ref}/>
                    <CustomCheckInput name={'tag'} value={"other"} outline={"#EA8C00"} type={"checkbox"}
                                      isDefault={true}
                                      ref_check={tag_other_ref}/>
                    <CustomCheckInput name={'tag'} value={"..."} outline={"#EF3F3E"} type={"checkbox"}
                                      ref_check={tag_custom_check_ref}
                                      ref_input={tag_custom_input_ref} isEdit={true}/>
                </form>

                <input className={"configure-task__date"} type={"date"} ref={date_ref}
                       defaultValue={`${today.toLocaleDateString('en-CA')}`}/>
            </div>

            <div className={"configure-task__buttons"}>
                <button className={"button button--isTransparent configure-task__cancel-button"}
                        onClick={handleClose}>Cancel
                </button>
                <button className={"button configure-task__ok-button"} onClick={editTaskHandler}
                        disabled={titleState.length < 1}>Edit Task
                </button>
            </div>

            {isLoading ? <Loading/> : null}

        </div>
    )
}

export default EditTask