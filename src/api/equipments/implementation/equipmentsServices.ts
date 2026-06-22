import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { normalizeApiResponse } from '@/api/abstractions/normalizeApiResponse';
import { httpClient } from '@/api/httpClient';
import type {
    EquipmentAvailabilityResponse,
    EquipmentRequest,
    EquipmentResponse,
    IEquipmentsServices,
} from '../iEquipmentsServices';

export const equipmentsServices: IEquipmentsServices = {
    async list() {
        const response = await httpClient.get<ApiResponse<EquipmentResponse[]>>('/api/equipments');
        return normalizeApiResponse(response.data);
    },
    async get(id) {
        const response = await httpClient.get<ApiResponse<EquipmentResponse>>(`/api/equipments/${id}`);
        return normalizeApiResponse(response.data);
    },
    async create(data: EquipmentRequest) {
        const response = await httpClient.post<ApiResponse<EquipmentResponse>>('/api/equipments', data);
        return normalizeApiResponse(response.data, 201);
    },
    async update(id, data: EquipmentRequest) {
        const response = await httpClient.put<ApiResponse<EquipmentResponse>>(`/api/equipments/${id}`, data);
        return normalizeApiResponse(response.data);
    },
    async remove(id) {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/equipments/${id}`);
        return normalizeApiResponse(response.data);
    },
    async availabilityByCategory(equipmentCategoryId) {
        const response = await httpClient.get<ApiResponse<EquipmentAvailabilityResponse[]>>(
            '/api/equipments/reports/availability-by-category',
            { params: { equipmentCategoryId } },
        );
        return normalizeApiResponse(response.data);
    },
    async availabilityByLaboratory(laboratoryId) {
        const response = await httpClient.get<ApiResponse<EquipmentAvailabilityResponse[]>>(
            '/api/equipments/reports/availability-by-laboratory',
            { params: { laboratoryId } },
        );
        return normalizeApiResponse(response.data);
    },
};
