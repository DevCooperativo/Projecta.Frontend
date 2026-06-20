import type { ApiResponse } from '../abstractions/apiResponse';

export interface AdministratorResponse {
    id: number;
    email: string;
    name?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAdministratorRequest {
    email: string;
    password: string;
}

export interface UpdateAdministratorRequest {
    email?: string;
}

export interface IAdministratorsServices {
    list(): Promise<ApiResponse<AdministratorResponse[]>>;
    get(id: number): Promise<ApiResponse<AdministratorResponse>>;
    create(data: CreateAdministratorRequest): Promise<ApiResponse<AdministratorResponse>>;
    update(id: number, data: UpdateAdministratorRequest): Promise<ApiResponse<AdministratorResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
