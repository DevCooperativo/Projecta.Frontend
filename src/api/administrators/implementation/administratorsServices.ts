import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    IAdministratorsServices,
    AdministratorResponse,
    CreateAdministratorRequest,
    UpdateAdministratorRequest,
} from '../iAdministratorsServices';

export const administratorsServices: IAdministratorsServices = {
    async list(): Promise<ApiResponse<AdministratorResponse[]>> {
        const response = await httpClient.get<ApiResponse<AdministratorResponse[]>>('/api/administrators');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<AdministratorResponse>> {
        const response = await httpClient.get<ApiResponse<AdministratorResponse>>(`/api/administrators/${id}`);
        return response.data;
    },

    async create(data: CreateAdministratorRequest): Promise<ApiResponse<AdministratorResponse>> {
        const response = await httpClient.post<ApiResponse<AdministratorResponse>>('/api/administrators', data);
        return response.data;
    },

    async update(id: number, data: UpdateAdministratorRequest): Promise<ApiResponse<AdministratorResponse>> {
        const response = await httpClient.put<ApiResponse<AdministratorResponse>>(`/api/administrators/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/administrators/${id}`);
        return response.data;
    },
};
