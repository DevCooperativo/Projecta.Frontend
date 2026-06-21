import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { normalizeApiResponse } from '@/api/abstractions/normalizeApiResponse';
import { httpClient } from '../../httpClient';
import type { ILaboratoriesServices, LaboratoryRequest, LaboratoryResponse } from '../iLaboratoriesServices';

export const laboratoriesServices: ILaboratoriesServices = {
    async list(): Promise<ApiResponse<LaboratoryResponse[]>> {
        const response = await httpClient.get<ApiResponse<LaboratoryResponse[]>>('/api/laboratories');
        return normalizeApiResponse(response.data);
    },
    async get(id: number): Promise<ApiResponse<LaboratoryResponse>> {
        const response = await httpClient.get<ApiResponse<LaboratoryResponse>>(`/api/laboratories/${id}`);
        return normalizeApiResponse(response.data);
    },
    async create(data: LaboratoryRequest): Promise<ApiResponse<LaboratoryResponse>> {
        const response = await httpClient.post<ApiResponse<LaboratoryResponse>>('/api/laboratories', data);
        return normalizeApiResponse(response.data, 201);
    },
    async update(id: number, data: LaboratoryRequest): Promise<ApiResponse<LaboratoryResponse>> {
        const response = await httpClient.put<ApiResponse<LaboratoryResponse>>(`/api/laboratories/${id}`, data);
        return normalizeApiResponse(response.data);
    },
    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/laboratories/${id}`);
        return normalizeApiResponse(response.data);
    },
};
