import React, {FC, memo} from "react";
import {SortType} from "../../commonScripts/itemSorting";
import Select, {MultiValue, SingleValue, StylesConfig} from "react-select";
import {useTypedSelector} from "../../hooks/reduxHooks";

export interface SortOptions {
    value: SortType,
    label: JSX.Element
}

interface SortSelectProps {
    className?: string,
    onChange: (selectedOption: SingleValue<SortOptions> | MultiValue<SortOptions>) => void
}

const SortSelect: FC<SortSelectProps> = memo(({className, onChange}) => {

    const theme = useTypedSelector(state => state.theme)

    const colourStyles: StylesConfig<SortOptions> = {
        // Wrapper of Selected item
        control: (styles) => ({
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
        option: (styles, {isFocused}) => ({
            ...styles,
            backgroundColor: theme === "dark"
                ? (isFocused) ? "#282828" : "#363636"
                : (isFocused) ? "#F5F5F5" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#1D1D1D"
        }),

        // Dropdown Arrow
        dropdownIndicator: (styles, {isFocused}) => ({
            ...styles,
            cursor: "pointer",
            filter: isFocused ? "brightness(0) invert(0) invert(42%) sepia(69%) saturate(900%) hue-rotate(186deg) brightness(99%) contrast(94%)" : "brightness(0) invert(0) invert(54%) sepia(16%) saturate(0%) hue-rotate(190deg) brightness(93%) contrast(92%)"
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

    return <Select
        className={className}
        options={options}
        styles={colourStyles}
        onChange={onChange}
        defaultValue={options[1]}/>
})

export default SortSelect