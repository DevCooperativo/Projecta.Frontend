import type { ApiResponse } from '../abstractions/apiResponse';

export interface LaboratoryResponse {
    id: number;
    name: string;
    description: string;
    storageSpace: boolean;
    maxOccupants: number;
    professorId: number;
    createdAt: string;
    updatedAt: string;
}

export interface LaboratoryRequest {
    name: string;
    description: string;
    storageSpace: boolean;
    maxOccupants: number;
    professorId: number;
}

export interface ILaboratoriesServices {
    list(): Promise<ApiResponse<LaboratoryResponse[]>>;
    get(id: number): Promise<ApiResponse<LaboratoryResponse>>;
    create(data: LaboratoryRequest): Promise<ApiResponse<LaboratoryResponse>>;
    update(id: number, data: LaboratoryRequest): Promise<ApiResponse<LaboratoryResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
