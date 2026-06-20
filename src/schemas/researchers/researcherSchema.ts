import { object, string, number, type InferType } from 'yup';

export const researcherSchema = object({
    personType: string().required('Tipo é obrigatório').oneOf(['professor', 'student'], 'Tipo inválido'),
    personId: number().typeError('Pessoa inválida').required('Selecione uma pessoa').positive('Selecione uma pessoa'),
    functionName: string().required('Função é obrigatória').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    weeklyHours: number().typeError('Horas inválidas').required('Horas semanais é obrigatório').min(1, 'Mínimo 1 hora').max(44, 'Máximo 44 horas'),
    startDate: string().required('Data de início é obrigatória'),
    endDate: string().optional(),
});

export type ResearcherValues = InferType<typeof researcherSchema>;
