import { number, object, string, type InferType } from 'yup';

export const equipmentSchema = object({
    name: string().trim().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    laboratoryId: number().typeError('Selecione o laboratório').required('Laboratório é obrigatório').positive(),
    projectId: number().typeError('Selecione o projeto').required('Projeto é obrigatório').positive(),
    equipmentCategoryId: number().typeError('Selecione a categoria').required('Categoria é obrigatória').positive(),
});

export type EquipmentValues = InferType<typeof equipmentSchema>;
