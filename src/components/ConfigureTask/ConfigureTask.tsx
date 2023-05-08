import React, {FC, useEffect, useRef, useState} from "react";
import CustomCheckTag from "../CustomCheckTag/CustomCheckTag";
import Loading from "../Loading/Loading";
import "./ConfigureTask.css"
import {useNavigate, useParams} from "react-router-dom";
import {serverFetchById, serverPostItem, serverUpdateItem} from "../../api/itemsAPI";
import {fetchItems} from "../../redux/slices/itemSlice";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";
import Button from "../BaseComponents/Button";
import Input from "../BaseComponents/Input";

export enum configureTaskType {
    CREATE,
    EDIT
}

interface ConfigureTaskProps {
    type: configureTaskType
}

const ConfigureTask: FC<ConfigureTaskProps> = ({type}) => {

    const theme = useTypedSelector(state => state.theme)

    const [isLoading, setIsLoading] = useState<boolean>(type === configureTaskType.EDIT)
    const [titleState, setTitleState] = useState<string>("")

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

    const typeText =
        type === configureTaskType.EDIT ? "Edit Task" :
            type === configureTaskType.CREATE ? "Add Task" :
                "Unknown operation"

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

    return (
        <div className={`configure-task configure-task--${theme} ${isLoading ? "configure-task--loading" : null}`}>
            <h3 className={"configure-task__title"}>{typeText}</h3>

            <Input
                placeholder={"Task Title"}
                className={"configure-task__input"}
                value={titleState}
                onInput={handleTitleChange}
            />

            <div className={"configure-task__options"}>
                <form className={"configure-task__tag-list"}>

                    <CustomCheckTag value={"home"}
                                    type={"checkbox"}
                                    ref_check={tag_home_ref}/>

                    <CustomCheckTag value={"health"}
                                    type={"checkbox"}
                                    ref_check={tag_health_ref}/>

                    <CustomCheckTag value={"work"}
                                    type={"checkbox"}
                                    ref_check={tag_work_ref}/>

                    <CustomCheckTag value={"other"}
                                    type={"checkbox"}
                                    isDefault={true}
                                    ref_check={tag_other_ref}/>

                    <CustomCheckTag value={"..."}
                                    type={"checkbox"}
                                    ref_check={tag_custom_check_ref}
                                    ref_input={tag_custom_input_ref}
                                    isEdit={true}/>

                </form>

                <Input
                    className={"configure-task__date"}
                    type={"date"}
                    innerRef={date_ref}
                    defaultValue={`${today.toLocaleDateString('en-CA')}`}
                />

            </div>

            <div className={"configure-task__buttons"}>

                <Button
                    text={"Cancel"}
                    className={"configure-task__cancel-button"}
                    onClick={handleClose}
                    isTransparent={true}/>

                <Button
                    text={typeText}
                    className={"configure-task__ok-button"}
                    onClick={handleSubmit}
                    disabled={titleState.length < 1}/>

            </div>

            {isLoading ? <Loading/> : null}

        </div>
    )
}

export default ConfigureTask

export const EditTask: FC = () => <ConfigureTask type={configureTaskType.EDIT}/>
export const AddTask: FC = () => <ConfigureTask type={configureTaskType.CREATE}/>