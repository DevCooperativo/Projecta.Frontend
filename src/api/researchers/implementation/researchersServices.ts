import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    IResearchersServices,
    ResearcherResponse,
    CreateResearcherRequest,
    UpdateResearcherRequest,
} from '../iResearchersServices';

export const researchersServices: IResearchersServices = {
    async list(): Promise<ApiResponse<ResearcherResponse[]>> {
        const response = await httpClient.get<ApiResponse<ResearcherResponse[]>>('/api/researchers');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<ResearcherResponse>> {
        const response = await httpClient.get<ApiResponse<ResearcherResponse>>(`/api/researchers/${id}`);
        return response.data;
    },

    async create(data: CreateResearcherRequest): Promise<ApiResponse<ResearcherResponse>> {
        const response = await httpClient.post<ApiResponse<ResearcherResponse>>('/api/researchers', data);
        return response.data;
    },

    async update(id: number, data: UpdateResearcherRequest): Promise<ApiResponse<ResearcherResponse>> {
        const response = await httpClient.put<ApiResponse<ResearcherResponse>>(`/api/researchers/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/researchers/${id}`);
        return response.data;
    },
};
