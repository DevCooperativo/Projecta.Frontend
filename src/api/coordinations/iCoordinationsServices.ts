import type { ApiResponse } from '../abstractions/apiResponse';

export interface CoordinationResponse {
    id: number;
    area: string;
    block: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCoordinationRequest {
    area: string;
    block: string;
    description: string;
}

export interface UpdateCoordinationRequest {
    area: string;
    block: string;
    description: string;
}

export interface ICoordinationsServices {
    list(): Promise<ApiResponse<CoordinationResponse[]>>;
    get(id: number): Promise<ApiResponse<CoordinationResponse>>;
    create(data: CreateCoordinationRequest): Promise<ApiResponse<CoordinationResponse>>;
    update(id: number, data: UpdateCoordinationRequest): Promise<ApiResponse<CoordinationResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
