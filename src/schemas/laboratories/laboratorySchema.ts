import { boolean, number, object, string, type InferType } from 'yup';

export const laboratorySchema = object({
    name: string().trim().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    maxOccupants: number().typeError('Informe a capacidade').required('Capacidade é obrigatória').integer().min(1, 'Mínimo 1 pessoa').max(999, 'Máximo 999 pessoas'),
    professorId: number().typeError('Selecione o responsável').required('Responsável é obrigatório').positive(),
    storageSpace: boolean().required(),
    description: string().trim().required('Descrição é obrigatória').min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
});

export type LaboratoryValues = InferType<typeof laboratorySchema>;
