import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type { ILaboratoriesServices, LaboratoryResponse } from '../iLaboratoriesServices';

export const laboratoriesServices: ILaboratoriesServices = {
    async list(): Promise<ApiResponse<LaboratoryResponse[]>> {
        const response = await httpClient.get<ApiResponse<LaboratoryResponse[]>>('/api/laboratories');
        return response.data;
    },
};
