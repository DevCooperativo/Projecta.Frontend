import { object, string, number, type InferType } from 'yup';

export const coordinatorSchema = object({
    professorId: number().typeError('Professor inválido').required('Professor é obrigatório').positive('Selecione um professor'),
    area: string().required('Área é obrigatória').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    startDate: string().required('Data de início é obrigatória'),
    endDate: string().optional(),
});

export type CoordinatorValues = InferType<typeof coordinatorSchema>;
