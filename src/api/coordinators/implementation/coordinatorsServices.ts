import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    ICoordinatorsServices,
    CoordinatorResponse,
    CreateCoordinatorRequest,
    UpdateCoordinatorRequest,
} from '../iCoordinatorsServices';

export const coordinatorsServices: ICoordinatorsServices = {
    async list(): Promise<ApiResponse<CoordinatorResponse[]>> {
        const response = await httpClient.get<ApiResponse<CoordinatorResponse[]>>('/api/coordinators');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<CoordinatorResponse>> {
        const response = await httpClient.get<ApiResponse<CoordinatorResponse>>(`/api/coordinators/${id}`);
        return response.data;
    },

    async create(data: CreateCoordinatorRequest): Promise<ApiResponse<CoordinatorResponse>> {
        const response = await httpClient.post<ApiResponse<CoordinatorResponse>>('/api/coordinators', data);
        return response.data;
    },

    async update(id: number, data: UpdateCoordinatorRequest): Promise<ApiResponse<CoordinatorResponse>> {
        const response = await httpClient.put<ApiResponse<CoordinatorResponse>>(`/api/coordinators/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/coordinators/${id}`);
        return response.data;
    },
};
