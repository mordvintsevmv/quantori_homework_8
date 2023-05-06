import React, {FC, useEffect, useRef, useState} from "react";
import CustomCheckInput from "../CustomCheckInput/CustomCheckInput";
import Loading from "../Loading/Loading";
import "./ConfigureTask.css"
import {useNavigate, useParams} from "react-router-dom";
import {serverFetchById, serverPostItem, serverUpdateItem} from "../../api/itemsAPI";
import {fetchItems} from "../../redux/slices/itemSlice";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";

export enum configureTaskType {
    CREATE,
    EDIT
}

interface ConfigureTaskProps {
    type: configureTaskType
}

const ConfigureTask: FC<ConfigureTaskProps> = ({type}) => {

    const [isLoading, setIsLoading] = useState<boolean>(type === configureTaskType.EDIT)
    const [titleState, setTitleState] = useState<string>("")
    const theme = useTypedSelector(state => state.theme)

    const {id} = useParams()

    const navigate = useNavigate()
    const dispatch = useTypedDispatch()

    const today = new Date()

    const date_ref = useRef<HTMLInputElement>(null)

    const tag_home_ref = useRef<HTMLInputElement>(null)
    const tag_health_ref = useRef<HTMLInputElement>(null)
    const tag_work_ref = useRef<HTMLInputElement>(null)
    const tag_other_ref = useRef<HTMLInputElement>(null)
    const tag_custom_check_ref = useRef<HTMLInputElement>(null)
    const tag_custom_input_ref = useRef<HTMLInputElement>(null)

    const handleSubmit = () => {

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

        // If edit task
        if (id && type === configureTaskType.EDIT) {
            serverUpdateItem(id, {title: title, tag: tag, date_complete: date})
                .then(() => dispatch(fetchItems()))
        }

        // If create Task
        if (type === configureTaskType.CREATE) {
            serverPostItem({
                id: crypto.randomUUID(),
                isChecked: false,
                title: title,
                tag: tag,
                description: "",
                subtasks: [],
                date_complete: date,
                date_created: new Date().toString()
            }).then(() => dispatch(fetchItems()))
        }

        navigate(-1)
    }

    useEffect(() => {
        if (id && type === configureTaskType.EDIT) {
            serverFetchById(id).then((item) => {
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
    }, [id, type])

    const handleClose = () => {
        navigate(-1)
    }

    const handleTitleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement
        setTitleState(target.value)
    }


    const typeText =
        type === configureTaskType.EDIT ? "Edit Task" :
            type === configureTaskType.CREATE ? "Add Task" :
                "Unknown operation"

    return (
        <div className={`configure-task configure-task--${theme} ${isLoading ? "configure-task--loading" : null}`}>
            <h3 className={"configure-task__title"}>{typeText}</h3>
            <input placeholder={"Task Title"} className={`text-input text-input--${theme} configure-task__input`} type={"text"}
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

                <input className={`configure-task__date text-input--${theme}`} type={"date"} ref={date_ref}
                       defaultValue={`${today.toLocaleDateString('en-CA')}`}/>
            </div>

            <div className={"configure-task__buttons"}>
                <button className={"button button--isTransparent configure-task__cancel-button"}
                        onClick={handleClose}>Cancel
                </button>
                <button className={`button button--${theme} configure-task__ok-button`} onClick={handleSubmit}
                        disabled={titleState.length < 1}>{typeText}
                </button>
            </div>

            {isLoading ? <Loading/> : null}

        </div>
    )
}

export default ConfigureTask

export const EditTask: FC = () => <ConfigureTask type={configureTaskType.EDIT}/>
export const AddTask: FC = () => <ConfigureTask type={configureTaskType.CREATE}/>