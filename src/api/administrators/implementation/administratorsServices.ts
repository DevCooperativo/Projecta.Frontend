import { httpClient } from '../../httpClient';
import type {
    IAdministratorsServices,
    AdministratorResponse,
    CreateAdministratorRequest,
    UpdateAdministratorRequest,
} from '../iAdministratorsServices';

export const administratorsServices: IAdministratorsServices = {
    async list(): Promise<AdministratorResponse[]> {
        const response = await httpClient.get<AdministratorResponse[]>('/api/administrators');
        return response.data;
    },

    async get(id: number): Promise<AdministratorResponse> {
        const response = await httpClient.get<AdministratorResponse>(`/api/administrators/${id}`);
        return response.data;
    },

    async create(data: CreateAdministratorRequest): Promise<AdministratorResponse> {
        const response = await httpClient.post<AdministratorResponse>('/api/administrators', data);
        return response.data;
    },

    async update(id: number, data: UpdateAdministratorRequest): Promise<AdministratorResponse> {
        const response = await httpClient.put<AdministratorResponse>(`/api/administrators/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<void> {
        await httpClient.delete(`/api/administrators/${id}`);
    },
};
