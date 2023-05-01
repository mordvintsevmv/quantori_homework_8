import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "../Header/Header";
import TaskList from "../TaskList/TaskList";
import {Item} from "../../types/Item";
import Modal from "../Modal/Modal";
import AddTask from "../AddTask/AddTask";
import TodayTasks from "../TodayTasks/TodayTasks";
import {change_API_path, delete_item, load_items, post_item, update_item} from "../../api/itemsAPI";

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
    const [isAddTaskModal, setIsAddTaskModal] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState<string>("")


    let in_work_items: Item[] = items.filter((item) => !item.isChecked && (item.title.toLowerCase().replace(/\s+/g, '').includes(searchInput.toLowerCase().replace(/\s+/g, '') || '')))
    const finished_items: Item[] = items.filter((item) => item.isChecked)

    const handleTodayShown = (): void => {
        localStorage.setItem('TodayTaskLastShown', JSON.stringify(new Date()))
        setIsTodayShown(true)
    }

    const addItem = async (title: string, tag: string, date: string): Promise<void> => {

        await post_item({
            id: crypto.randomUUID(),
            isChecked: false,
            title: title,
            tag: tag,
            date: date,
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

    const openModal = (): void => {
        setIsAddTaskModal(true)
    }

    const closeModal = (): void => {
        setIsAddTaskModal(false)
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

                <button className={"button App__add-button"} onClick={openModal}>
                    + New Task
                </button>

            </div>


            <TaskList title={"All Tasks"} items={in_work_items} deleteItem={deleteItem} checkItem={checkItem}/>
            <TaskList title={"Completed Tasks"} items={finished_items} deleteItem={deleteItem}
                      checkItem={checkItem}/>

            {!isTodayShown && <Modal closeModal={handleTodayShown}
                                     modal_children={<TodayTasks items={in_work_items}
                                                                 setTodayShown={handleTodayShown}/>}/>}

            {isAddTaskModal && <Modal closeModal={closeModal}
                                      modal_children={<AddTask closeModal={closeModal} addTask={addItem}/>}/>}

        </div>
    );
}

export default App;
