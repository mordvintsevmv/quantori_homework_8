import React, {useEffect} from 'react';
import './App.css';
import Modal from "../Modal/Modal";
import {AddTask, EditTask} from "../ConfigureTask/ConfigureTask";
import {change_API_path, serverAPI} from "../../api/itemsAPI";
import {Route, Routes} from "react-router-dom";
import {fetchItems, setTodayShown} from "../../redux/slices/itemSlice";
import {useTypedDispatch, useTypedSelector} from "../../hooks/reduxHooks";
import Home from "../Home/Home";
import Header from "../Header/Header";
import TodayTasks from "../TodayTasks/TodayTasks";
import {statusType} from "../../types/statusType";

const App = () => {

    const {isTodayShown, status} = useTypedSelector(state => state.items)
    const theme = useTypedSelector(state => state.theme)

    const dispatch = useTypedDispatch()

    useEffect(() => {
        const checkAPI = async () => {
            try {
                await serverAPI.get('http://localhost:3004/items')
            } catch (e) {
                change_API_path()
            } finally {
                dispatch(fetchItems())
            }
        }

        checkAPI()

    }, [])

    const handleTodayClose = () => {
        dispatch(setTodayShown(true))
    }

    return (
        <div className={`App App--${theme}`}>

            <Header title={"ToDo List"}/>

            <Routes>
                <Route path="/" element={<Home/>}>

                    <Route path="add-task" element={<Modal
                        modal_children={<AddTask/>}/>}/>
                    <Route path="edit/:id" element={<Modal
                        modal_children={<EditTask/>}/>}/>
                </Route>
            </Routes>

            {!isTodayShown && status === statusType.SUCCESS &&
                <Modal onClose={handleTodayClose} modal_children={<TodayTasks/>}/>}


        </div>
    );
}

export default App;
