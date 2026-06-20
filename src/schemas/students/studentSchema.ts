import { object, string, number, type InferType } from 'yup';

export const studentCreateSchema = object({
    name: string().required('Nome é obrigatório'),
    email: string().email('E-mail inválido').required('E-mail é obrigatório'),
    registration: string().required('Matrícula é obrigatória'),
    password: string().min(6, 'Senha deve ter ao menos 6 caracteres').required('Senha é obrigatória'),
    birthdate: string().required('Data de nascimento é obrigatória'),
    term: number().typeError('Período inválido').min(1, 'Mínimo 1').required('Período é obrigatório'),
    shift: string().oneOf(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'], 'Turno inválido').required('Turno é obrigatório'),
});

export const studentEditSchema = object({
    name: string().required('Nome é obrigatório'),
    email: string().email('E-mail inválido').required('E-mail é obrigatório'),
    registration: string().required('Matrícula é obrigatória'),
    birthdate: string().required('Data de nascimento é obrigatória'),
    term: number().typeError('Período inválido').min(1, 'Mínimo 1').required('Período é obrigatório'),
    shift: string().oneOf(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'], 'Turno inválido').required('Turno é obrigatório'),
});

export type StudentCreateValues = InferType<typeof studentCreateSchema>;
export type StudentEditValues = InferType<typeof studentEditSchema>;

// Legacy aliases
export const studentSchema = studentCreateSchema;
export type StudentFormValues = StudentCreateValues;
