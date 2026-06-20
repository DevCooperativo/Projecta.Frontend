import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    ICoordinationsServices,
    CoordinationResponse,
    CreateCoordinationRequest,
    UpdateCoordinationRequest,
} from '../iCoordinationsServices';

export const coordinationsServices: ICoordinationsServices = {
    async list(): Promise<ApiResponse<CoordinationResponse[]>> {
        const response = await httpClient.get<ApiResponse<CoordinationResponse[]>>('/api/coordinations');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<CoordinationResponse>> {
        const response = await httpClient.get<ApiResponse<CoordinationResponse>>(`/api/coordinations/${id}`);
        return response.data;
    },

    async create(data: CreateCoordinationRequest): Promise<ApiResponse<CoordinationResponse>> {
        const response = await httpClient.post<ApiResponse<CoordinationResponse>>('/api/coordinations', data);
        return response.data;
    },

    async update(id: number, data: UpdateCoordinationRequest): Promise<ApiResponse<CoordinationResponse>> {
        const response = await httpClient.put<ApiResponse<CoordinationResponse>>(`/api/coordinations/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/coordinations/${id}`);
        return response.data;
    },
};
