import React, {FC} from "react";
import {useTypedSelector} from "../../hooks/reduxHooks";
import "./Button.scss"

interface ButtonProps {
    className?: string,
    isTransparent?: boolean,
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean
}

const Button: FC<ButtonProps> = ({className, isTransparent = false, disabled = false, onClick, text}) => {

    const theme = useTypedSelector(state => state.theme)

    if (isTransparent) {
        return (
            <button
                className={`button button--${theme} button--isTransparent button--isTransparent-${theme} ${className}`}
                onClick={onClick}
                disabled={disabled}>
                {text}
            </button>
        )
    } else {
        return (
            <button
                className={`button button--${theme} ${className}`}
                onClick={onClick}
                disabled={disabled}>
                {text}
            </button>
        )
    }

}

export default Button