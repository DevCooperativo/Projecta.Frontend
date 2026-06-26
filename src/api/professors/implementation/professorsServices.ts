import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    IProfessorsServices,
    ProfessorResponse,
    CreateProfessorRequest,
    UpdateProfessorRequest,
    BorrowMetrics,
} from '../iProfessorsServices';

export const professorsServices: IProfessorsServices = {
    async list(): Promise<ApiResponse<ProfessorResponse[]>> {
        const response = await httpClient.get<ApiResponse<ProfessorResponse[]>>('/api/professors');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<ProfessorResponse>> {
        const response = await httpClient.get<ApiResponse<ProfessorResponse>>(`/api/professors/${id}`);
        return response.data;
    },

    async create(data: CreateProfessorRequest): Promise<ApiResponse<ProfessorResponse>> {
        const response = await httpClient.post<ApiResponse<ProfessorResponse>>('/api/professors', data);
        return response.data;
    },

    async update(id: number, data: UpdateProfessorRequest): Promise<ApiResponse<ProfessorResponse>> {
        const response = await httpClient.put<ApiResponse<ProfessorResponse>>(`/api/professors/${id}`, data);
        return response.data;
    },

    async changeCoordination(coordinationId: number): Promise<ApiResponse<void>> {
        const response = await httpClient.post<ApiResponse<void>>('/api/professors/change-coordination', { coordinationId });
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/professors/${id}`);
        return response.data;
    },

    async metrics(): Promise<ApiResponse<BorrowMetrics>> {
        const response = await httpClient.get<ApiResponse<BorrowMetrics>>('/api/professors/metrics');
        return response.data;
    },
};
