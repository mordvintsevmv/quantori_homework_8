import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "../Header/Header";
import TaskList from "../TaskList/TaskList";
import {Item} from "../../types/Item";
import Modal from "../Modal/Modal";
import AddTask from "../AddTask/AddTask";
import TodayTasks from "../TodayTasks/TodayTasks";
import {change_API_path, delete_item, load_items, post_item, update_item} from "../../api/itemsAPI";
import {Route, Routes, useNavigate} from "react-router-dom";
import EditTask from "../EditTask/EditTask";
import Select, {SingleValue} from 'react-select'
import TaskTag from "../TaskTag/TaskTag";

const isTodayTasksShown = (): boolean => {

    const shown_date = localStorage.getItem('TodayTaskLastShown')

    let date_string: string

    if (shown_date !== null) {
        date_string = JSON.parse(shown_date)
    } else {
        date_string = "Jan 01 1900"
    }

    const today: Date = new Date()
    const parsed_date: Date = new Date(Date.parse(date_string))

    if (shown_date) {
        if (parsed_date.getFullYear() === today.getFullYear()
            && parsed_date.getMonth() === today.getMonth()
            && parsed_date.getDate() === today.getDate()
        ) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}


const App = () => {

    const [items, setItems] = useState<Item[]>([])

    const [isAddTaskModal, setIsAddTaskModal] = useState<boolean>(false)
    const [isTodayShown, setIsTodayShown] = useState<boolean>(isTodayTasksShown())
    const [searchInput, setSearchInput] = useState<string>("")
    const [filterTags, setFilterTags] = useState<string[]>([])
    const [sortType, setSortType] = useState<string>("sort-date-create-decreasing")

    useEffect(() => {

        fetch('http://localhost:3004/items')
            .catch(() => change_API_path())
            .finally(() => load_items().then((response: Item[]) => {
                setItems(response)
            }))

    }, [])

    const dateCreatedSort = (item1: Item, item2: Item, type: string = "decreasing"): number => {
        const date1 = new Date(item1.date_created)
        const date2 = new Date(item2.date_created)

        if (type === "decreasing") {
            return +date2 - +date1
        } else {
            return +date1 - +date2
        }
    }

    const dateCompleteSort = (item1: Item, item2: Item, type: string = "decreasing"): number => {
        const date1 = new Date(item1.date_complete)
        const date2 = new Date(item2.date_complete)

        if (type === "decreasing") {
            return +date2 - +date1
        } else {
            return +date1 - +date2
        }
    }

    const titleSort = (item1: Item, item2: Item, type: string = "decreasing") => {
        if (type === "decreasing") {
            return item2.title.localeCompare(item1.title)
        } else {
            return item1.title.localeCompare(item2.title)
        }
    }

    let in_work_items: Item[] = items.filter((item) => !item.isChecked && (item.title.toLowerCase().replace(/\s+/g, '').includes(searchInput.toLowerCase().replace(/\s+/g, '') || '')))

    if (filterTags.length > 0) {
        if (filterTags.includes("custom"))
            in_work_items = in_work_items.filter((item) => item.tag.some((tag) => filterTags.includes(tag) || !['home', 'health', "work", "other"].includes(tag)))
        else
            in_work_items = in_work_items.filter((item) => item.tag.some((tag) => filterTags.includes(tag)))
    }

    switch (sortType) {
        case "sort-title-decreasing":
            in_work_items = in_work_items.sort((item1, item2) => titleSort(item1, item2, "decreasing"));
            break;
        case "sort-title-increasing":
            in_work_items = in_work_items.sort((item1, item2) => titleSort(item1, item2, "increasing"));
            break;
        case "sort-date-complete-decreasing":
            in_work_items = in_work_items.sort((item1, item2) => dateCompleteSort(item1, item2, "decreasing"));
            break;
        case "sort-date-complete-increasing":
            in_work_items = in_work_items.sort((item1, item2) => dateCompleteSort(item1, item2, "increasing"));
            break;
        case "sort-date-create-increasing":
            in_work_items = in_work_items.sort((item1, item2) => dateCreatedSort(item1, item2, "increasing"));
            break;
        case "sort-date-create-decreasing":
        default:
            in_work_items = in_work_items.sort((item1, item2) => dateCreatedSort(item1, item2, "decreasing"));
            break;

    }
    const finished_items: Item[] = items.filter((item) => item.isChecked)


    const openModal = (): void => {
        setIsAddTaskModal(true)
    }

    const closeModal = (): void => {
        setIsAddTaskModal(false)
    }

    const setTodayShown = (): void => {
        localStorage.setItem('TodayTaskLastShown', JSON.stringify(new Date()))
        setIsTodayShown(true)
    }


    const addItem = async (title: string, tag: string[], date: string): Promise<void> => {

        await post_item({
            id: crypto.randomUUID(),
            isChecked: false,
            title: title,
            tag: tag,
            date_complete: date,
            date_created: new Date().toString()
        })
            .then(async (): Promise<void> => {
                await load_items()
                    .then((items: Item[]): void => {
                        setItems(items);
                        setIsAddTaskModal(false)
                    })
            })
            .catch(error => console.error(error))
    }


    const deleteItem = async (id: string): Promise<void> => {
        await delete_item(id)
            .then(async (): Promise<void> => {
                await load_items()
                    .then((items: Item[]): void => {
                        setItems(items);
                        setIsAddTaskModal(false)
                    })
            })
            .catch(error => console.error(error))

    }

    const checkItem = async (id: string): Promise<void> => {

        const item_index: number = items.findIndex((item: Item): boolean => item.id === id)

        await update_item(id, {...items[item_index], isChecked: !items[item_index].isChecked})
            .then(async (): Promise<void> => {
                await load_items()
                    .then((items: Item[]): void => {
                        setItems(items);
                        setIsAddTaskModal(false)
                    })
            })
            .catch(error => console.error(error))
    }

    const editTask = async (id: string, title: string, tag: string[], date: string): Promise<void> => {

        const item_index: number = items.findIndex((item: Item): boolean => item.id === id)

        await update_item(id, {...items[item_index], title: title, tag: tag, date_complete: date})
            .then(async (): Promise<void> => {
                await load_items()
                    .then((items: Item[]): void => {
                        setItems(items);
                    })
            })
            .catch(error => console.error(error))
    }


    const navigate = useNavigate()

    const handleFilterTag = (tag: string) => {
        if (filterTags.includes(tag)) {
            setFilterTags(filterTags.filter((filter_tag) => filter_tag !== tag))
        } else {
            setFilterTags([...filterTags, tag])
        }
    }

    interface SortOptions {
        value: string,
        label: JSX.Element
    }

    const options: SortOptions[] = [
        {value: 'sort-date-create-increasing', label: <div className={"sort sort--increasing"}>Date Created</div>},
        {value: 'sort-date-create-decreasing', label: <div className={"sort sort--decreasing"}>Date Created</div>},
        {value: 'sort-date-complete-increasing', label: <div className={"sort sort--increasing"}>Date Complete</div>},
        {value: 'sort-date-complete-decreasing', label: <div className={"sort sort--decreasing"}>Date Complete</div>},
        {value: 'sort-title-increasing', label: <div className={"sort sort--increasing"}>Title</div>},
        {value: 'sort-title-decreasing', label: <div className={"sort sort--decreasing"}>Title</div>},
    ]

    const handleSelectChange = (selectedOption: SingleValue<SortOptions>) => {
        if (selectedOption)
            setSortType(selectedOption.value)
    }

    return (
        <div className="App">

            <Header title={"To Do List"}/>

            <div className={"App__controls"}>
                <input className={" App__search text-input "} type={"text"} placeholder={"Search Task"}
                       value={searchInput} onChange={(event) => {
                    setSearchInput(event.target.value)
                }}/>
                <button className={"button App__add-button"} onClick={openModal}>+ New Task</button>
            </div>

            <div className={"App__filters"}>
                <div className={"App__filter-tags"}>
                    <button className={filterTags.includes("home") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"} onClick={()=>{handleFilterTag("home")}}>
                        <TaskTag name={"home"}/>
                    </button>

                    <button className={filterTags.includes("health") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"} onClick={()=>{handleFilterTag("health")}}>
                        <TaskTag name={"health"}/>
                    </button>

                    <button className={filterTags.includes("work") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"} onClick={()=>{handleFilterTag("work")}}>
                        <TaskTag name={"work"}/>
                    </button>

                    <button className={filterTags.includes("other") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"} onClick={()=>{handleFilterTag("other")}}>
                        <TaskTag name={"other"}/>
                    </button>

                    <button className={filterTags.includes("custom") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"} onClick={()=>{handleFilterTag("custom")}}>
                        <TaskTag name={"custom"}/>
                    </button>

                </div>

                <Select className={"App__sort"} options={options} onChange={handleSelectChange}
                        defaultValue={options[1]}/>


            </div>

            <TaskList title={"All Tasks"} items={in_work_items} deleteItem={deleteItem} checkItem={checkItem}/>
            <TaskList title={"Completed Tasks"} items={finished_items} deleteItem={deleteItem}
                      checkItem={checkItem}/>

            {!isTodayShown && <Modal closeModal={setTodayShown}
                                     modal_children={<TodayTasks items={in_work_items}
                                                                 setTodayShown={setTodayShown}/>}/>}

            {isAddTaskModal &&
                <Modal closeModal={closeModal}
                       modal_children={<AddTask closeModal={closeModal} addTask={addItem}/>}/>}

            <Routes>

                <Route path={"/edit/:id"} element={<Modal closeModal={() => navigate(-1)}
                                                          modal_children={<EditTask editTask={editTask}/>}/>}/>
            </Routes>
        </div>
    );
}

export default App;
