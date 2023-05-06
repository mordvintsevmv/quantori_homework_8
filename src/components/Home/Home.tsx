import React, {useEffect, useMemo, useState} from 'react';
import '../Home/Home.css';
import TaskList from "../TaskList/TaskList";
import {Item} from "../../types/Item";
import {Link, Outlet, useSearchParams} from "react-router-dom";
import Select, {MultiValue, SingleValue, StylesConfig} from 'react-select'
import TaskTag from "../TaskTag/TaskTag";
import {sortItems, SortType} from "../../commonScripts/item_sorting";
import {useTypedSelector} from "../../hooks/reduxHooks";

const Home = () => {

    const {items, status, error} = useTypedSelector(state => state.items)
    const [searchParams, setSearchParams] = useSearchParams()
    const theme = useTypedSelector(state => state.theme)

    const search = searchParams.get("search")
    const filters = searchParams.get("filters")

    const [filterTags, setFilterTags] = useState<string[]>([])
    const [sortType, setSortType] = useState<SortType>(SortType.DATE_CREATE_DECREASING)
    const [searchInput, setSearchInput] = useState<string>("")

    // Sorting and filtering items
    let in_work_items: Item[] = useMemo(
        () => {
            let temp_items = items.filter((item) => !item.isChecked && (item.title.toLowerCase().replace(/\s+/g, '').includes(searchInput.toLowerCase().replace(/\s+/g, '') || '')))

            if (filterTags.length > 0) {
                if (filterTags.includes("custom"))
                    temp_items = temp_items.filter((item) => item.tag.some((tag: string) => filterTags.includes(tag) || !['home', 'health', "work", "other"].includes(tag)))
                else
                    temp_items = temp_items.filter((item) => item.tag.some((tag: string) => filterTags.includes(tag)))
            }

            temp_items.sort((item1, item2) => sortItems(item1, item2, sortType))

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
            searchParams.set('search', input.value)
        else
            searchParams.delete('search')

        setSearchParams(searchParams)
        setSearchInput(input.value)
    }

    interface SortOptions {
        value: SortType,
        label: JSX.Element
    }


    const colourStyles: StylesConfig<SortOptions> = {
        // Wrapper of Selected item
        control: (styles, {menuIsOpen}) => ({
            ...styles,
            backgroundColor: theme === "dark" ? "#363636" : "#F5F5F5",
            color: theme === "dark" ? "#FFFFFF" : "#1D1D1D",
           borderColor: theme === "dark" ? "#202020" : "#D2D2D2"
        }),

        // Selected Item
        singleValue: (styles) => ({
            ...styles,
            backgroundColor: theme === "dark" ? "#363636" : "#F5F5F5",
            color: theme === "dark" ? "#FFFFFF" : "#1D1D1D"
        }),

        // Menu Wrapper
        menu: (styles) => ({...styles, backgroundColor: theme === "dark" ? "#363636" : "#F5F5F5"}),


        // Menu Item
        option: (styles, {isFocused, isSelected}) => ({
            ...styles,
            backgroundColor: theme === "dark"
                ? (isFocused) ? "#282828" : "#363636"
                : (isFocused) ? "#F5F5F5" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#1D1D1D"
        }),

    };

    const options: SortOptions[] = [
        {value: SortType.DATE_CREATE_INCREASING, label: <div className={"sort sort--increasing"}>Date Created</div>},
        {value: SortType.DATE_CREATE_DECREASING, label: <div className={"sort sort--decreasing"}>Date Created</div>},
        {value: SortType.DATE_COMPLETE_INCREASING, label: <div className={"sort sort--increasing"}>Date Complete</div>},
        {value: SortType.DATE_COMPLETE_DECREASING, label: <div className={"sort sort--decreasing"}>Date Complete</div>},
        {value: SortType.TITLE_INCREASING, label: <div className={"sort sort--increasing"}>Title</div>},
        {value: SortType.TITLE_DECREASING, label: <div className={"sort sort--decreasing"}>Title</div>},
    ]

    const handleSelectChange = (selectedOption: SingleValue<SortOptions> | MultiValue<SortOptions>) => {
        if (selectedOption && "value" in selectedOption) {
            setSortType(selectedOption.value)
        }
    }

    useEffect(() => {
        if (search)
            setSearchInput(search)

        if (filters)
            setFilterTags(filters.split(','))
    }, [])

    return (
        <div className="Home">

            <div className={"Home__controls"}>
                <input className={` Home__search text-input text-input--${theme}`} type={"text"}
                       placeholder={"Search Task"}
                       value={searchInput} onInput={handleSearch}/>

                <Link to={"/add-task"}>
                    <button className={`button button--${theme} Home__add-button`}>
                        + New Task
                    </button>
                </Link>

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

                <Select className={"Home__sort"} options={options} styles={colourStyles} onChange={handleSelectChange}
                        defaultValue={options[1]}/>


            </div>

            <TaskList title={"All Tasks"} items={in_work_items}/>
            <TaskList title={"Completed Tasks"} items={finished_items}/>

            <Outlet/>

        </div>
    );
}

export default Home;
