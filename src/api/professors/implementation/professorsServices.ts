import { httpClient } from '../../httpClient';
import type {
    IProfessorsServices,
    ProfessorResponse,
    CreateProfessorRequest,
    UpdateProfessorRequest,
} from '../iProfessorsServices';

export const professorsServices: IProfessorsServices = {
    async list(): Promise<ProfessorResponse[]> {
        const response = await httpClient.get<ProfessorResponse[]>('/api/professors');
        return response.data;
    },

    async get(id: number): Promise<ProfessorResponse> {
        const response = await httpClient.get<ProfessorResponse>(`/api/professors/${id}`);
        return response.data;
    },

    async create(data: CreateProfessorRequest): Promise<ProfessorResponse> {
        const response = await httpClient.post<ProfessorResponse>('/api/professors', data);
        return response.data;
    },

    async update(id: number, data: UpdateProfessorRequest): Promise<ProfessorResponse> {
        const response = await httpClient.put<ProfessorResponse>(`/api/professors/${id}`, data);
        return response.data;
    },

    async changeCoordination(coordinationId: number): Promise<void> {
        await httpClient.post('/api/professors/change-coordination', { coordinationId });
    },

    async remove(id: number): Promise<void> {
        await httpClient.delete(`/api/professors/${id}`);
    },
};
