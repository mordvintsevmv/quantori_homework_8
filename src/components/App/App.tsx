import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "../Header/Header";
import TaskList from "../TaskList/TaskList";
import {Item} from "../../types/Item";
import Modal from "../Modal/Modal";
import AddTask from "../ConfigureTask/AddTask";
import TodayTasks from "../TodayTasks/TodayTasks";
import {change_API_path, delete_item, load_items, post_item, update_item} from "../../api/itemsAPI";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import EditTask from "../ConfigureTask/EditTask";
import Select, {SingleValue} from 'react-select'
import TaskTag from "../TaskTag/TaskTag";
import {sortItems, SortType} from "../../commonScripts/item_sorting";

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

    const [isTodayShown, setIsTodayShown] = useState<boolean>(true)
    const [searchInput, setSearchInput] = useState<string>("")
    const [filterTags, setFilterTags] = useState<string[]>([])
    const [sortType, setSortType] = useState<SortType>(SortType.DATE_CREATE_DECREASING)

    const navigate = useNavigate()

    // Sorting and filtering items
    let in_work_items: Item[] = items.filter((item) => !item.isChecked && (item.title.toLowerCase().replace(/\s+/g, '').includes(searchInput.toLowerCase().replace(/\s+/g, '') || '')))

    in_work_items.sort((item1, item2) => sortItems(item1, item2, sortType))

    if (filterTags.length > 0) {
        if (filterTags.includes("custom"))
            in_work_items = in_work_items.filter((item) => item.tag.some((tag) => filterTags.includes(tag) || !['home', 'health', "work", "other"].includes(tag)))
        else
            in_work_items = in_work_items.filter((item) => item.tag.some((tag) => filterTags.includes(tag)))
    }

    const finished_items: Item[] = items.filter((item) => item.isChecked)

    const handleTodayShown = (): void => {
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

    const handleFilterTag = (tag: string) => {
        if (filterTags.includes(tag)) {
            setFilterTags(filterTags.filter((filter_tag) => filter_tag !== tag))
        } else {
            setFilterTags([...filterTags, tag])
        }
    }

    interface SortOptions {
        value: SortType,
        label: JSX.Element
    }

    const options: SortOptions[] = [
        {value: SortType.DATE_CREATE_INCREASING, label: <div className={"sort sort--increasing"}>Date Created</div>},
        {value: SortType.DATE_CREATE_DECREASING, label: <div className={"sort sort--decreasing"}>Date Created</div>},
        {value: SortType.DATE_COMPLETE_INCREASING, label: <div className={"sort sort--increasing"}>Date Complete</div>},
        {value: SortType.DATE_COMPLETE_DECREASING, label: <div className={"sort sort--decreasing"}>Date Complete</div>},
        {value: SortType.TITLE_INCREASING, label: <div className={"sort sort--increasing"}>Title</div>},
        {value: SortType.TITLE_DECREASING, label: <div className={"sort sort--decreasing"}>Title</div>},
    ]

    const handleSelectChange = (selectedOption: SingleValue<SortOptions>) => {
        if (selectedOption)
            setSortType(selectedOption.value)
    }

    useEffect(() => {

        fetch('http://localhost:3004/items')
            .catch(() => change_API_path())
            .finally(() => load_items().then((response: Item[]) => {
                setItems(response)
                setIsTodayShown(isTodayTasksShown())
            }))
    }, [])

    return (
        <div className="App">

            <Header title={"To Do List"}/>

            <div className={"App__controls"}>
                <input className={" App__search text-input "} type={"text"} placeholder={"Search Task"}
                       value={searchInput} onChange={(event) => {
                    setSearchInput(event.target.value)
                }}/>

                <Link to={"/add-task"}>
                    <button className={"button App__add-button"}>
                        + New Task
                    </button>
                </Link>

            </div>

            <div className={"App__filters"}>
                <div className={"App__filter-tags"}>
                    <button
                        className={filterTags.includes("home") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("home")
                        }}>
                        <TaskTag name={"home"}/>
                    </button>

                    <button
                        className={filterTags.includes("health") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("health")
                        }}>
                        <TaskTag name={"health"}/>
                    </button>

                    <button
                        className={filterTags.includes("work") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("work")
                        }}>
                        <TaskTag name={"work"}/>
                    </button>

                    <button
                        className={filterTags.includes("other") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("other")
                        }}>
                        <TaskTag name={"other"}/>
                    </button>

                    <button
                        className={filterTags.includes("custom") ? "App__filter-tag-item--active" : "App__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("custom")
                        }}>
                        <TaskTag name={"custom"}/>
                    </button>

                </div>

                <Select className={"App__sort"} options={options} onChange={handleSelectChange}
                        defaultValue={options[1]}/>


            </div>

            <TaskList title={"All Tasks"} items={in_work_items} deleteItem={deleteItem} checkItem={checkItem}/>
            <TaskList title={"Completed Tasks"} items={finished_items} deleteItem={deleteItem}
                      checkItem={checkItem}/>

            {!isTodayShown && <Modal closeModal={handleTodayShown}
                                     modal_children={<TodayTasks items={in_work_items}
                                                                 setTodayShown={handleTodayShown}/>}/>}

            <Routes>

                <Route path={"/add-task"} element={<Modal closeModal={() => navigate(-1)}
                                                          modal_children={<AddTask addTask={addItem}/>}/>}/>

                <Route path={"/edit/:id"} element={<Modal closeModal={() => navigate(-1)}
                                                          modal_children={<EditTask editTask={editTask}/>}/>}/>
            </Routes>
        </div>
    );
}

export default App;
