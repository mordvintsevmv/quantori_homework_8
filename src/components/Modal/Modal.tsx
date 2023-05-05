import React, {FC} from "react";
import "./Modal.css"
import {useNavigate} from "react-router-dom";

interface ModalProps {
    onClose?: () => void,
    modal_children: React.ReactNode
}

const Modal: FC<ModalProps> = ({onClose, modal_children}) => {

    const navigate = useNavigate()

    const closeHandle = () => {
        if (onClose)
            onClose()
        navigate(-1)
    }

    return (
        <div className={"overlay"} onClick={closeHandle}>
            <div className={"modal"} onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                e.stopPropagation()
            }}>
                {modal_children}
            </div>
        </div>
    )
}

export default Modal