import "./CustomCheckInput.css"
import React, {FC} from "react";

interface CustomCheckInputProps {
    type?: string,
    name: string,
    value: string,
    outline: string,
    isDefault?: boolean,
    input_element: React.ReactNode,
    ref_check?: React.Ref<HTMLInputElement>
}

const CustomCheckInput: FC<CustomCheckInputProps> = ({
                                                         type = 'radio',
                                                         name,
                                                         value,
                                                         outline,
                                                         isDefault = false,
                                                         input_element,
                                                         ref_check
                                                     }) => {

    return (
        <label className={"custom-check-input"} style={{borderColor: outline}}>
            <input className={"custom-check-input__input"} type={type} name={name} value={value}
                   defaultChecked={isDefault} ref={ref_check}/>
            <div className={"custom-check-input__children"}>
                {input_element}
            </div>
        </label>
    )

}

export default CustomCheckInput