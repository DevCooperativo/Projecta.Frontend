import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, type DefaultValues, type FieldValues, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import type { ObjectSchema } from "yup"
import { api } from "../../../config/api"

export interface IUseLoginHFManager<T extends FieldValues> {
    schema: ObjectSchema<T>
    defaultValues: T

}

export const UseLoginHFManager = <T extends FieldValues,>({ schema, defaultValues }: IUseLoginHFManager<T>) => {
    const methods = useForm({ resolver: yupResolver(schema), defaultValues: defaultValues as DefaultValues<T>, context: defaultValues })

    const handleSubmit: SubmitHandler<T> = async (data) => {
        try {
            const response = await api.post("/api/auth/authenticate", { data })
            console.log(response)

        } catch (error) {
            console.error(error)
            // AppErrorHelper().toastErrors(error, toastProvider)
        }
    }
    const handleError: SubmitErrorHandler<T> = (errors) => {
        // const flatErrors = YupHelper().FlattenYupError(errors)
        // Object.entries(flatErrors).flatMap(([, value]) => {
        console.error(errors)
        // })
    }


    return {
        methods,
        handleSubmit,
        handleError
    }
}