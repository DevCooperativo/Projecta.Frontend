import type { ApiResponse } from '../abstractions/apiResponse';

export interface EquipmentResponse {
    id: number;
    name: string;
    laboratoryId: number;
    projectId: number;
    equipmentCategoryId: number;
    createdAt: string;
    updatedAt: string;
}

export interface EquipmentRequest {
    name: string;
    laboratoryId: number;
    projectId: number;
    equipmentCategoryId: number;
}

export interface EquipmentAvailabilityResponse {
    equipmentName: string;
    isBorrowed: boolean;
    totalQuantity: number;
    availableQuantity: number;
    laboratoryId: number;
    laboratoryName: string;
    projectId: number;
    projectName: string;
    categoryId: number;
    categoryDescription: string;
    categoryPowerSource: string;
}

export interface IEquipmentsServices {
    list(): Promise<ApiResponse<EquipmentResponse[]>>;
    get(id: number): Promise<ApiResponse<EquipmentResponse>>;
    create(data: EquipmentRequest): Promise<ApiResponse<EquipmentResponse>>;
    update(id: number, data: EquipmentRequest): Promise<ApiResponse<EquipmentResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
    availabilityByCategory(equipmentCategoryId?: number): Promise<ApiResponse<EquipmentAvailabilityResponse[]>>;
    availabilityByLaboratory(laboratoryId?: number): Promise<ApiResponse<EquipmentAvailabilityResponse[]>>;
}
