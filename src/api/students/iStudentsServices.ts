import type { ApiResponse } from '../abstractions/apiResponse';

export interface StudentResponse {
    id: number;
    name: string;
    email: string;
    registration: string;
    birthdate: string;
    term: number;
    shift: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStudentRequest {
    name: string;
    email: string;
    registration: string;
    password: string;
    birthdate: string;
    term: number;
    shift: string;
}

export interface UpdateStudentRequest {
    name?: string;
    email?: string;
    registration?: string;
    birthdate?: string;
    term?: number;
    shift?: string;
}

export interface IStudentsServices {
    list(): Promise<ApiResponse<StudentResponse[]>>;
    get(id: number): Promise<ApiResponse<StudentResponse>>;
    create(data: CreateStudentRequest): Promise<ApiResponse<StudentResponse>>;
    update(id: number, data: UpdateStudentRequest): Promise<ApiResponse<StudentResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
