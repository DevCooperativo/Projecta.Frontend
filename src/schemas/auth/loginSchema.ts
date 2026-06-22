import { string, object } from "yup"
export const LoginSchema = () => {
    return (object().shape({
        email: string().email('E-mail inválido').required('E-mail é obrigatório'),
        password: string().required('Senha é obrigatória'),
    }))
}
export interface LoginSchemaType {
    email: string
    password: string
}