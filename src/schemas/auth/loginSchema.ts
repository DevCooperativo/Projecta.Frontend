import { string, object } from "yup"
export const LoginSchema = () => {
    return (object().shape({
        email: string().required(),
        password: string().required()
    }))
}
export interface LoginSchemaType {
    email: string
    password: string
}