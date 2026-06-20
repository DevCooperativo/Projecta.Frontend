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

export interface ILaboratoriesServices {
    list(): Promise<ApiResponse<LaboratoryResponse[]>>;
}
