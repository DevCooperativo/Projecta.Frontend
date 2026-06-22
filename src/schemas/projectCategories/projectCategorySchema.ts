import { boolean, object, string, type InferType } from 'yup';

export const projectCategorySchema = object({
    name: string().trim().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    area: string().required('Área do conhecimento é obrigatória'),
    description: string().trim().required('Descrição é obrigatória').min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
    commerciallyRelevant: boolean().required(),
});

export type ProjectCategoryValues = InferType<typeof projectCategorySchema>;
