import type { ApiResponse } from '../abstractions/apiResponse';

export interface CoordinatorResponse {
    id: number;
    area: string;
    startDate: string;
    endDate?: string;
    professorId: number;
    projectId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCoordinatorRequest {
    area: string;
    startDate: string;
    endDate?: string;
    professorId: number;
    projectId: number;
}

export interface UpdateCoordinatorRequest {
    area: string;
    startDate: string;
    endDate?: string;
    professorId: number;
    projectId: number;
}

export interface ICoordinatorsServices {
    list(): Promise<ApiResponse<CoordinatorResponse[]>>;
    get(id: number): Promise<ApiResponse<CoordinatorResponse>>;
    create(data: CreateCoordinatorRequest): Promise<ApiResponse<CoordinatorResponse>>;
    update(id: number, data: UpdateCoordinatorRequest): Promise<ApiResponse<CoordinatorResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
