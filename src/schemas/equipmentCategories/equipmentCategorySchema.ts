import { boolean, object, string, type InferType } from 'yup';

export const equipmentCategorySchema = object({
    powerSource: string().required('Fonte de alimentação é obrigatória'),
    fragile: boolean().required(),
    description: string().trim().required('Descrição é obrigatória').min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
});

export type EquipmentCategoryValues = InferType<typeof equipmentCategorySchema>;
