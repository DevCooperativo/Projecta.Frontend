import { forwardRef, type InputHTMLAttributes } from "react";

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {

}
export const Input = forwardRef<HTMLInputElement, IInput>(
    ({ ...rest }, ref) => {
        return (
            <input ref={ref} {...rest} />
        )
    }
)
Input.displayName = "Input"