import type { ApiResponse } from '../abstractions/apiResponse';

export interface ProfessorResponse {
    id: number;
    name: string;
    email: string;
    registration: string;
    telephone: string;
    coordinationId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProfessorRequest {
    name: string;
    email: string;
    registration: string;
    telephone: string;
    coordinationId: number;
}

export interface UpdateProfessorRequest {
    name?: string;
    registration?: string;
    telephone?: string;
}

export interface IProfessorsServices {
    list(): Promise<ApiResponse<ProfessorResponse[]>>;
    get(id: number): Promise<ApiResponse<ProfessorResponse>>;
    create(data: CreateProfessorRequest): Promise<ApiResponse<ProfessorResponse>>;
    update(id: number, data: UpdateProfessorRequest): Promise<ApiResponse<ProfessorResponse>>;
    changeCoordination(coordinationId: number): Promise<ApiResponse<void>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
