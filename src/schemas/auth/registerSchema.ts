import { object, string } from 'yup';

export const registerSchema = object({
    name: string().required('Nome é obrigatório'),
    profile: string().required('Selecione um perfil'),
    email: string().email('E-mail inválido').required('E-mail é obrigatório'),
    registration: string().required('Matrícula/SIAPE é obrigatória'),
    justification: string().required('Justificativa é obrigatória'),
});

export interface RegisterSchemaType {
    name: string;
    profile: string;
    email: string;
    registration: string;
    justification: string;
}
