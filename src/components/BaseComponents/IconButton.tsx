import React, {FC} from "react";
import "./IconButton.scss"

interface IconButtonProps {
    className?: string,
    size?: "s" | "m" | "l",
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    src: string,
    alt?: string
}

const IconButton: FC<IconButtonProps> = ({className, size = "m", onClick, src, alt}) => {
    return (
        <button onClick={onClick} className={`icon-button icon-button--${size} ${className}`}>
            <img className={`icon-button__img`} src={src}
                 alt={alt}/>
        </button>
    )
}

export default IconButton