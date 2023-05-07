import React, {FC} from "react";
import {useTypedSelector} from "../../hooks/reduxHooks";
import "./Input.scss"

interface InputProps {
    className?: string,
    type?: string,
    placeholder?: string,
    value?: string,
    defaultValue?: string,
    onInput?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    ref?: React.Ref<HTMLInputElement>
}
const Input: FC<InputProps> = ({className, type = "text", placeholder, value, defaultValue, onInput, ref}) => {
    const theme = useTypedSelector(state => state.theme)

    return <input
        className={`text-input text-input--${theme} ${className}`}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onInput={onInput}
        ref={ref}
    />

}

export default Input