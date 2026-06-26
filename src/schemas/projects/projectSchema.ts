import { object, string, number, type InferType } from 'yup';

export const projectCreateSchema = object({
    name: string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    description: string().required('Descrição é obrigatória').min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
    startDate: string().required('Data de início é obrigatória'),
    endDate: string().optional(),
    status: string().required('Status é obrigatório').min(1, 'Status é obrigatório'),
    laboratoryId: number().typeError('Laboratório inválido').required('Laboratório é obrigatório').positive('Selecione um laboratório'),
    projectCategoryId: number().typeError('Categoria inválida').required('Categoria é obrigatória').positive('Selecione uma categoria'),
});

export const projectEditSchema = projectCreateSchema;

export type ProjectCreateValues = InferType<typeof projectCreateSchema>;
export type ProjectEditValues = InferType<typeof projectEditSchema>;
