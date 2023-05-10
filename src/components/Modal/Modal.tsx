import React, {FC} from "react";
import "./Modal.css"

interface ModalProps {
    closeModal: () => void,
    modal_children: React.ReactNode
}

const Modal: FC<ModalProps> = ({closeModal, modal_children}) => {
    return (
        <div className={"overlay"} onClick={closeModal}>
            <div className={"modal"} onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                e.stopPropagation()
            }}>
                {modal_children}
            </div>
        </div>
    )
}

export default Modal