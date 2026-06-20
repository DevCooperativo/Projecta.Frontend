import { object, string, type InferType } from 'yup';

export const coordinationCreateSchema = object({
    area: string().required('Área é obrigatória').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    block: string().required('Bloco é obrigatório'),
    description: string().required('Descrição é obrigatória').min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
});

export const coordinationEditSchema = coordinationCreateSchema;

export type CoordinationCreateValues = InferType<typeof coordinationCreateSchema>;
export type CoordinationEditValues = InferType<typeof coordinationEditSchema>;
