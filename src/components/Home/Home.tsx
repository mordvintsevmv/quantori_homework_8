import React, {useEffect, useMemo, useState} from 'react';
import '../Home/Home.css';
import TaskList from "../TaskList/TaskList";
import {Item} from "../../types/Item";
import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import {MultiValue, SingleValue} from 'react-select'
import TaskTag from "../TaskTag/TaskTag";
import {sortItems, SortType} from "../../commonScripts/itemSorting";
import {useTypedSelector} from "../../hooks/reduxHooks";
import {statusType} from "../../types/statusType";
import Loading from "../Loading/Loading";
import SortSelect, {SortOptions} from "./SortSelect";
import Button from "../BaseComponents/Button";
import Input from "../BaseComponents/Input";

const Home = () => {

    const {items, status, error} = useTypedSelector(state => state.items)

    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()

    const searchQuery = searchParams.get("q")
    const filtersQuery = searchParams.get("filters")

    const [filterTags, setFilterTags] = useState<string[]>([])
    const [sortType, setSortType] = useState<SortType>(SortType.DATE_CREATE_DECREASING)
    const [searchInput, setSearchInput] = useState<string>("")

    // Sorting and filtering items
    const in_work_items: Item[] = useMemo(
        () => {
            // filtering by search input
            let temp_items = items.filter((item) => !item.isChecked && (item.title.toLowerCase().replace(/\s+/g, '').includes(searchInput.toLowerCase().replace(/\s+/g, '') || '')))

            // filtering by tags
            if (filterTags.length > 0) {
                if (filterTags.includes("custom"))
                    temp_items = temp_items.filter((item) => item.tag.some((tag: string) => filterTags.includes(tag) || !['home', 'health', "work", "other"].includes(tag)))
                else
                    temp_items = temp_items.filter((item) => item.tag.some((tag: string) => filterTags.includes(tag)))
            }

            // sorting
            temp_items = temp_items.sort((item1, item2) => sortItems(item1, item2, sortType))

            return temp_items
        }, [items, searchInput, filterTags, sortType])


    const finished_items: Item[] = useMemo(() => items.filter((item) => item.isChecked), [items])

    const handleFilterTag = (tag: string) => {
        if (filterTags.includes(tag)) {
            const tags = filterTags.filter((filter_tag) => filter_tag !== tag)

            if (tags.length > 0)
                searchParams.set('filters', tags.toString())
            else
                searchParams.delete('filters')

            setFilterTags(tags)
        } else {
            const tags = [...filterTags, tag]

            if (tags.length > 0)
                searchParams.set('filters', tags.toString())
            else
                searchParams.delete('filters')

            setFilterTags(tags)
        }

        setSearchParams(searchParams)

    }

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {

        const input = event.target as HTMLInputElement

        if (input.value.length > 0)
            searchParams.set('q', input.value)
        else
            searchParams.delete('q')

        setSearchParams(searchParams)
        setSearchInput(input.value)
    }

    const handleSelectChange = (selectedOption: SingleValue<SortOptions> | MultiValue<SortOptions>) => {
        if (selectedOption && "value" in selectedOption) {
            setSortType(selectedOption.value)
        }
    }

    const handleNewTask = () => {
        navigate('/add-task')
    }

    useEffect(() => {
        if (searchQuery)
            setSearchInput(searchQuery)

        if (filtersQuery)
            setFilterTags(filtersQuery.split(','))
    }, [])


    if ([statusType.IDLE].includes(status))
        return <Loading/>

    if ([statusType.ERROR].includes(status))
        return <div>{error}</div>

    return (
        <div className="Home">

            <div className={"Home__controls"}>
                <Input
                    className={"Home__search"}
                    placeholder={"Search Task"}
                    value={searchInput}
                    onInput={handleSearch}
                />

                <Button className={"Home__add-button"} text={"+ New Task"} onClick={handleNewTask}/>
            </div>

            <div className={"Home__filters"}>
                <div className={"Home__filter-tags"}>
                    <button
                        className={filterTags.includes("home") ? "Home__filter-tag-item--active" : "Home__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("home")
                        }}>
                        <TaskTag name={"home"}/>
                    </button>

                    <button
                        className={filterTags.includes("health") ? "Home__filter-tag-item--active" : "Home__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("health")
                        }}>
                        <TaskTag name={"health"}/>
                    </button>

                    <button
                        className={filterTags.includes("work") ? "Home__filter-tag-item--active" : "Home__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("work")
                        }}>
                        <TaskTag name={"work"}/>
                    </button>

                    <button
                        className={filterTags.includes("other") ? "Home__filter-tag-item--active" : "Home__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("other")
                        }}>
                        <TaskTag name={"other"}/>
                    </button>

                    <button
                        className={filterTags.includes("custom") ? "Home__filter-tag-item--active" : "Home__filter-tag-item--inactive"}
                        onClick={() => {
                            handleFilterTag("custom")
                        }}>
                        <TaskTag name={"custom"}/>
                    </button>

                </div>

                <SortSelect onChange={handleSelectChange} className={"Home__sort"}/>

            </div>

            <TaskList title={"All Tasks"} items={in_work_items}/>
            <TaskList title={"Completed Tasks"} items={finished_items}/>

            <Outlet/>

        </div>
    );
}

export default Home;
