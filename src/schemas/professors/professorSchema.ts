import { object, string, number, type InferType } from 'yup';

export const professorCreateSchema = object({
    name: string().required('Nome é obrigatório'),
    email: string().email('E-mail inválido').required('E-mail é obrigatório'),
    registration: string().required('Matrícula/SIAPE é obrigatória'),
    telephone: string().required('Telefone é obrigatório'),
    coordinationId: number().typeError('Selecione uma coordenadoria').required('Coordenadoria é obrigatória').min(1, 'Selecione uma coordenadoria'),
});

export const professorEditSchema = object({
    name: string().required('Nome é obrigatório'),
    registration: string().required('Matrícula/SIAPE é obrigatória'),
    telephone: string().required('Telefone é obrigatório'),
    coordinationId: number().typeError('Selecione uma coordenadoria').required('Coordenadoria é obrigatória').min(1, 'Selecione uma coordenadoria'),
});

export type ProfessorCreateValues = InferType<typeof professorCreateSchema>;
export type ProfessorEditValues = InferType<typeof professorEditSchema>;

// Legacy aliases
export const professorSchema = professorCreateSchema;
export type ProfessorFormValues = ProfessorCreateValues;
