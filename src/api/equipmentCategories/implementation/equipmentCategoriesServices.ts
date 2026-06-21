import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { normalizeApiResponse } from '@/api/abstractions/normalizeApiResponse';
import { httpClient } from '@/api/httpClient';
import type {
    EquipmentCategoryRequest,
    EquipmentCategoryResponse,
    IEquipmentCategoriesServices,
} from '../iEquipmentCategoriesServices';

export const equipmentCategoriesServices: IEquipmentCategoriesServices = {
    async list() {
        const response = await httpClient.get<ApiResponse<EquipmentCategoryResponse[]>>('/api/equipmentCategories');
        return normalizeApiResponse(response.data);
    },
    async get(id) {
        const response = await httpClient.get<ApiResponse<EquipmentCategoryResponse>>(`/api/equipmentCategories/${id}`);
        return normalizeApiResponse(response.data);
    },
    async create(data: EquipmentCategoryRequest) {
        const response = await httpClient.post<ApiResponse<EquipmentCategoryResponse>>('/api/equipmentCategories', data);
        return normalizeApiResponse(response.data, 201);
    },
    async update(id, data: EquipmentCategoryRequest) {
        const response = await httpClient.put<ApiResponse<EquipmentCategoryResponse>>(`/api/equipmentCategories/${id}`, data);
        return normalizeApiResponse(response.data);
    },
    async remove(id) {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/equipmentCategories/${id}`);
        return normalizeApiResponse(response.data);
    },
};
