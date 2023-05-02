import "./CustomCheckInput.css"
import React, {FC} from "react";
import TaskTag from "../TaskTag/TaskTag";

interface CustomCheckInputProps {
    type?: string,
    name: string,
    value: string,
    outline: string,
    isDefault?: boolean,
    ref_check?: React.Ref<HTMLInputElement>,
    ref_input?: React.Ref<HTMLInputElement>,
    isEdit?: boolean
}

const CustomCheckInput: FC<CustomCheckInputProps> = ({
                                                         type = 'radio',
                                                         name,
                                                         value,
                                                         outline,
                                                         isDefault = false,
                                                         ref_check,
                                                         ref_input,
                                                         isEdit
                                                     }) => {

    return (
        <label className={"custom-check-input"} style={{borderColor: outline}}>
            <input className={"custom-check-input__input"}
                   type={type}
                   name={name}
                   value={value}
                   defaultChecked={isDefault}
                   ref={ref_check}/>
            <div className={"custom-check-input__children"}>
                <TaskTag name={value} isEdit={isEdit} ref_input={ref_input}/>
            </div>
        </label>
    )
}

export default CustomCheckInput