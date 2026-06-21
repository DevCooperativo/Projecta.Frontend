import type { ApiResponse } from '../abstractions/apiResponse';

export const EQUIPMENT_POWER_SOURCES = [
    'Energia elétrica (110V/220V)',
    'Bateria',
    'USB',
    'Energia solar',
    'Manual / não necessita energia',
] as const;

export interface EquipmentCategoryResponse {
    id: number;
    powerSource: string;
    fragile: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface EquipmentCategoryRequest {
    powerSource: string;
    fragile: boolean;
    description: string;
}

export interface IEquipmentCategoriesServices {
    list(): Promise<ApiResponse<EquipmentCategoryResponse[]>>;
    get(id: number): Promise<ApiResponse<EquipmentCategoryResponse>>;
    create(data: EquipmentCategoryRequest): Promise<ApiResponse<EquipmentCategoryResponse>>;
    update(id: number, data: EquipmentCategoryRequest): Promise<ApiResponse<EquipmentCategoryResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
