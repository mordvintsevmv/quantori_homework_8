import "./CustomCheckTag.scss"
import React, {FC} from "react";
import TaskTag from "../TaskTag/TaskTag";

interface CustomCheckTagProps {
    type?: string,
    name?: string,
    value: string,
    isDefault?: boolean,
    ref_check?: React.Ref<HTMLInputElement>,
    ref_input?: React.Ref<HTMLInputElement>,
    isEdit?: boolean
}

const CustomCheckTag: FC<CustomCheckTagProps> = ({
                                                     type = 'radio',
                                                     name = 'tag',
                                                     value,
                                                     isDefault = false,
                                                     ref_check,
                                                     ref_input,
                                                     isEdit
                                                 }) => {

    return (
        <label className={"custom-check-tag"}>

            <input className={"custom-check-tag__input"}
                   type={type}
                   name={name}
                   value={value}
                   defaultChecked={isDefault}
                   ref={ref_check}/>

            <div className={"custom-check-tag__children"}>
                <TaskTag name={value} isEdit={isEdit} ref_input={ref_input}/>
            </div>

        </label>
    )
}

export default CustomCheckTag